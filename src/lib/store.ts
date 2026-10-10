import { useSyncExternalStore } from "react";
import {
  DEFAULT_INPUTS,
  INPUT_BY_KEY,
  type InputKey,
  type InputValues,
  computeModel,
  type ModelOutput,
} from "./model";
import { clamp } from "./format";

export type NodeType = "root" | "trunk" | "branch" | "leaves" | "fruit";

export interface NodeSel {
  type: NodeType;
  id: string; // per root: input key; per branch: "0".."4"; per fruit: metric id
}

interface State {
  inputs: InputValues;
  selected: NodeSel | null;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let version = 0;

const rawInputs: InputValues = { ...DEFAULT_INPUTS };

/* Proxy reattivo: ogni mutazione notifica i sottoscrittori e
   invalida il frame del renderer (version bump letto dal canvas). */
const inputsProxy = new Proxy(rawInputs, {
  set(target, prop: string, value: number) {
    const def = INPUT_BY_KEY[prop as InputKey];
    if (!def) return true;
    const clamped = clamp(Math.round(value / def.step) * def.step, def.min, def.max);
    if (target[prop as InputKey] === clamped) return true;
    target[prop as InputKey] = clamped;
    notify();
    return true;
  },
});

let modelCache: { version: number; model: ModelOutput } | null = null;

function notify() {
  version++;
  listeners.forEach((l) => l());
}

export const store = {
  get inputs(): InputValues {
    return inputsProxy;
  },
  get selected(): NodeSel | null {
    return state.selected;
  },
  get version(): number {
    return version;
  },
  set(key: InputKey, value: number) {
    inputsProxy[key] = value; // passa dal trap del Proxy
  },
  applyPreset(values: InputValues) {
    (Object.keys(values) as InputKey[]).forEach((k) => {
      rawInputs[k] = values[k];
    });
    notify();
  },
  select(sel: NodeSel | null) {
    if (
      state.selected?.type === sel?.type &&
      state.selected?.id === sel?.id
    )
      return;
    state.selected = sel;
    notify();
    if (sel && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("node-select", {
          detail: { type: sel.type, id: sel.id, version },
        })
      );
    }
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getVersion(): number {
    return version;
  },
  getModel(): ModelOutput {
    if (!modelCache || modelCache.version !== version) {
      modelCache = { version, model: computeModel(rawInputs) };
    }
    return modelCache.model;
  },
};

const state: State = {
  inputs: inputsProxy,
  selected: null,
};

export function useStoreVersion(): number {
  return useSyncExternalStore(store.subscribe, store.getVersion);
}
