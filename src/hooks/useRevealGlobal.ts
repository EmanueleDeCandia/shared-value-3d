import { useEffect } from "react";

/** Osserva tutti gli elementi .rv e aggiunge .on quando entrano nel viewport. */
export function useRevealGlobal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("on");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Conta da zero al valore quando l'elemento entra nel viewport. */
export function useCountUp(target: number, format: (v: number) => string) {
  useEffect(() => {
    /* gestito dal componente Num */
  }, [target, format]);
}
