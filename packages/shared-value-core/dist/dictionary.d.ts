/**
 * Dizionario Unificato delle Variabili e Parametri di Modello
 * Mappa ogni variabile con nome, unità di misura, spiegazione concettuale e legami sistemici.
 */
export interface ParameterMetadata {
    key: string;
    label: string;
    unit: string;
    defaultValueRegime: number;
    defaultValuePilota: number;
    min: number;
    max: number;
    step: number;
    group: "popolazione" | "adozione" | "logistica" | "commerciale" | "costanti";
    description: string;
    source: string;
}
export declare const PARAMETERS_DICTIONARY: Record<string, ParameterMetadata>;
//# sourceMappingURL=dictionary.d.ts.map