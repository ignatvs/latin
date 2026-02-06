document.getElementById("paole").focus();


// =========================================================
// 1. CONSOLIDACIÓN DE DATOS
// =========================================================

// Unimos todos los arrays externos en uno solo.
// IMPORTANTE: Los archivos .js externos deben cargarse ANTES de este script.
const diccionarioGlobal = [
  ...sustantivos,
  ...adjetivos,
  ...verbos,
  ...pronombres,
  ...conjunciones,
  ...interjecciones,
  ...preposiciones,
  ...adverbios
];

// =========================================================
// 2. MOTORES DE FLEXIÓN (LOGICA GRAMATICAL)
// =========================================================

// A. TERMINACIONES REGULARES (Sustantivos/Adjetivos)
const terminaciones = {
  "1.ª": {
    sufijos: ["a", "ae", "ae", "am", "ā", "a", "ae", "ārum", "īs", "ās", "īs", "ae"]
  },
  "2.ª": {
    m: ["us", "ī", "ō", "um", "ō", "e", "ī", "ōrum", "īs", "ōs", "īs", "ī"], 
    n: ["um", "ī", "ō", "um", "ō", "um", "a", "ōrum", "īs", "a", "īs", "a"]
  },
  "3.ª": {
    m_f: ["*", "is", "ī", "em", "e", "*", "ēs", "um", "ibus", "ēs", "ibus", "ēs"], 
    n:   ["*", "is", "ī", "*", "e", "*", "a", "um", "ibus", "a", "ibus", "a"]
  },
  "4.ª": {
    m_f: ["us", "ūs", "uī", "um", "ū", "us", "ūs", "uum", "ibus", "ūs", "ibus", "ūs"],
    n:   ["ū", "ūs", "ū", "ū", "ū", "ū", "ua", "uum", "ibus", "ua", "ibus", "ua"]
  },
  "5.ª": {
    m_f: ["ēs", "eī", "eī", "em", "ē", "ēs", "ēs", "ērum", "ēbus", "ēs", "ēbus", "ēs"]
  }
};

// B. CONJUGACIONES (Verbos - Modelo Presente)
const conjugaciones = {
  "1.ª": ["ō", "ās", "at", "āmus", "ātis", "ant"],
  "2.ª": ["eō", "ēs", "et", "ēmus", "ētis", "ent"],
  "3.ª": ["ō", "is", "it", "imus", "itis", "unt"],
  "3.ª (Mixta)": ["iō", "is", "it", "imus", "itis", "iunt"],
  "4.ª": ["iō", "īs", "it", "īmus", "ītis", "iunt"],
  "Irregular": ["sum", "es", "est", "sumus", "estis", "sunt"]
};

// C. TABLAS PREDEFINIDAS (Pronombres Irregulares)
// Aquí definimos el HTML directo para los casos difíciles.
const tablasPronombres = {
  "ego": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse;">
      <tr style="background:#ddd;"><th>Caso</th><th>Singular (Yo)</th><th>Plural (Nosotros)</th></tr>
      <tr><td><b>Nom</b></td><td>ego</td><td>nōs</td></tr>
      <tr><td><b>Gen</b></td><td>meī</td><td>nostrī / nostrum</td></tr>
      <tr><td><b>Dat</b></td><td>mihi</td><td>nōbīs</td></tr>
      <tr><td><b>Acus</b></td><td>mē</td><td>nōs</td></tr>
      <tr><td><b>Abl</b></td><td>mē</td><td>nōbīs</td></tr>
    </table>`,
  
  "tu": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse;">
      <tr style="background:#ddd;"><th>Caso</th><th>Singular (Tú)</th><th>Plural (Vosotros)</th></tr>
      <tr><td><b>Nom</b></td><td>tū</td><td>vōs</td></tr>
      <tr><td><b>Gen</b></td><td>tuī</td><td>vestrī / vestrum</td></tr>
      <tr><td><b>Dat</b></td><td>tibi</td><td>vōbīs</td></tr>
      <tr><td><b>Acus</b></td><td>tē</td><td>vōs</td></tr>
      <tr><td><b>Abl</b></td><td>tē</td><td>vōbīs</td></tr>
    </table>`,

  "hic": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>hic</td><td>haec</td><td>hoc</td></tr>
      <tr><td><b>Gen</b></td><td>huius</td><td>huius</td><td>huius</td></tr>
      <tr><td><b>Dat</b></td><td>huic</td><td>huic</td><td>huic</td></tr>
      <tr><td><b>Acus</b></td><td>hunc</td><td>hanc</td><td>hoc</td></tr>
      <tr><td><b>Abl</b></td><td>hōc</td><td>hāc</td><td>hōc</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>hī</td><td>hae</td><td>haec</td></tr>
      <tr><td><b>Gen</b></td><td>hōrum</td><td>hārum</td><td>hōrum</td></tr>
      <tr><td><b>Dat</b></td><td>hīs</td><td>hīs</td><td>hīs</td></tr>
      <tr><td><b>Acus</b></td><td>hōs</td><td>hās</td><td>haec</td></tr>
      <tr><td><b>Abl</b></td><td>hīs</td><td>hīs</td><td>hīs</td></tr>
    </table>`,

    "ille": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>ille</td><td>illa</td><td>illud</td></tr>
      <tr><td><b>Gen</b></td><td>illīus</td><td>illīus</td><td>illīus</td></tr>
      <tr><td><b>Dat</b></td><td>illī</td><td>illī</td><td>illī</td></tr>
      <tr><td><b>Acus</b></td><td>illum</td><td>illam</td><td>illud</td></tr>
      <tr><td><b>Abl</b></td><td>illō</td><td>illā</td><td>illō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>illī</td><td>illae</td><td>illa</td></tr>
      <tr><td><b>Gen</b></td><td>illōrum</td><td>illārum</td><td>illōrum</td></tr>
      <tr><td><b>Dat</b></td><td>illīs</td><td>illīs</td><td>illīs</td></tr>
      <tr><td><b>Acus</b></td><td>illōs</td><td>illās</td><td>illa</td></tr>
      <tr><td><b>Abl</b></td><td>illīs</td><td>illīs</td><td>illīs</td></tr>
    </table>`,

    "is": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>is</td><td>ea</td><td>id</td></tr>
      <tr><td><b>Gen</b></td><td>eius</td><td>eius</td><td>eius</td></tr>
      <tr><td><b>Dat</b></td><td>eī</td><td>eī</td><td>eī</td></tr>
      <tr><td><b>Acus</b></td><td>eum</td><td>eam</td><td>id</td></tr>
      <tr><td><b>Abl</b></td><td>eō</td><td>eā</td><td>eō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>eī</td><td>eae</td><td>ea</td></tr>
      <tr><td><b>Gen</b></td><td>eōrum</td><td>eārum</td><td>eōrum</td></tr>
      <tr><td><b>Dat</b></td><td>eīs</td><td>eīs</td><td>eīs</td></tr>
      <tr><td><b>Acus</b></td><td>eōs</td><td>eās</td><td>ea</td></tr>
      <tr><td><b>Abl</b></td><td>eīs</td><td>eīs</td><td>eīs</td></tr>
    </table>`,
"qui": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>quī</td><td>quae</td><td>quod</td></tr>
      <tr><td><b>Gen</b></td><td>cuius</td><td>cuius</td><td>cuius</td></tr>
      <tr><td><b>Dat</b></td><td>cui</td><td>cui</td><td>cui</td></tr>
      <tr><td><b>Acus</b></td><td>quem</td><td>quam</td><td>quod</td></tr>
      <tr><td><b>Abl</b></td><td>quō</td><td>quā</td><td>quō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>quī</td><td>quae</td><td>quae</td></tr>
      <tr><td><b>Gen</b></td><td>quōrum</td><td>quārum</td><td>quōrum</td></tr>
      <tr><td><b>Dat</b></td><td>quibus</td><td>quibus</td><td>quibus</td></tr>
      <tr><td><b>Acus</b></td><td>quōs</td><td>quās</td><td>quae</td></tr>
      <tr><td><b>Abl</b></td><td>quibus</td><td>quibus</td><td>quibus</td></tr>
    </table>`,
"iste": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>iste</td><td>ista</td><td>istud</td></tr>
      <tr><td><b>Gen</b></td><td>istīus</td><td>istīus</td><td>istīus</td></tr>
      <tr><td><b>Dat</b></td><td>istī</td><td>istī</td><td>istī</td></tr>
      <tr><td><b>Acus</b></td><td>istum</td><td>istam</td><td>istud</td></tr>
      <tr><td><b>Abl</b></td><td>istō</td><td>istā</td><td>istō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>istī</td><td>istae</td><td>ista</td></tr>
      <tr><td><b>Gen</b></td><td>istōrum</td><td>istārum</td><td>istōrum</td></tr>
      <tr><td><b>Dat</b></td><td>istīs</td><td>istīs</td><td>istīs</td></tr>
      <tr><td><b>Acus</b></td><td>istōs</td><td>istās</td><td>ista</td></tr>
      <tr><td><b>Abl</b></td><td>istīs</td><td>istīs</td><td>istīs</td></tr>
    </table>`,

  "ipse": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>ipse</td><td>ipsa</td><td>ipsum</td></tr>
      <tr><td><b>Gen</b></td><td>ipsīus</td><td>ipsīus</td><td>ipsīus</td></tr>
      <tr><td><b>Dat</b></td><td>ipsī</td><td>ipsī</td><td>ipsī</td></tr>
      <tr><td><b>Acus</b></td><td>ipsum</td><td>ipsam</td><td>ipsum</td></tr>
      <tr><td><b>Abl</b></td><td>ipsō</td><td>ipsā</td><td>ipsō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>ipsī</td><td>ipsae</td><td>ipsa</td></tr>
      <tr><td><b>Gen</b></td><td>ipsōrum</td><td>ipsārum</td><td>ipsōrum</td></tr>
      <tr><td><b>Dat</b></td><td>ipsīs</td><td>ipsīs</td><td>ipsīs</td></tr>
      <tr><td><b>Acus</b></td><td>ipsōs</td><td>ipsās</td><td>ipsa</td></tr>
      <tr><td><b>Abl</b></td><td>ipsīs</td><td>ipsīs</td><td>ipsīs</td></tr>
    </table>`,
"idem": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>īdem</td><td>eadem</td><td>idem</td></tr>
      <tr><td><b>Gen</b></td><td>eiusdem</td><td>eiusdem</td><td>eiusdem</td></tr>
      <tr><td><b>Dat</b></td><td>eīdem</td><td>eīdem</td><td>eīdem</td></tr>
      <tr><td><b>Acus</b></td><td>eundem</td><td>eandem</td><td>idem</td></tr>
      <tr><td><b>Abl</b></td><td>eōdem</td><td>eādem</td><td>eōdem</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>eīdem/iīdem</td><td>eaedem</td><td>eadem</td></tr>
      <tr><td><b>Gen</b></td><td>eōrundem</td><td>eārundem</td><td>eōrundem</td></tr>
      <tr><td><b>Dat</b></td><td>eīsdem</td><td>eīsdem</td><td>eīsdem</td></tr>
      <tr><td><b>Acus</b></td><td>eōsdem</td><td>eāsdem</td><td>eadem</td></tr>
      <tr><td><b>Abl</b></td><td>eīsdem</td><td>eīsdem</td><td>eīsdem</td></tr>
    </table>`,
"quis": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc. / Fem.</th><th>Neutro</th></tr>
      <tr><td colspan="3" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>quis</td><td>quid</td></tr>
      <tr><td><b>Gen</b></td><td>cuius</td><td>cuius</td></tr>
      <tr><td><b>Dat</b></td><td>cui</td><td>cui</td></tr>
      <tr><td><b>Acus</b></td><td>quem</td><td>quid</td></tr>
      <tr><td><b>Abl</b></td><td>quō</td><td>quō</td></tr>
      <tr><td colspan="3" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>quī</td><td>quae</td></tr>
      <tr><td><b>Gen</b></td><td>quōrum</td><td>quōrum</td></tr>
      <tr><td><b>Dat</b></td><td>quibus</td><td>quibus</td></tr>
      <tr><td><b>Acus</b></td><td>quōs</td><td>quae</td></tr>
      <tr><td><b>Abl</b></td><td>quibus</td><td>quibus</td></tr>
    </table>`,

  "alius": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>alius</td><td>alia</td><td>aliud</td></tr>
      <tr><td><b>Gen</b></td><td>alīus</td><td>alīus</td><td>alīus</td></tr>
      <tr><td><b>Dat</b></td><td>aliī</td><td>aliī</td><td>aliī</td></tr>
      <tr><td><b>Acus</b></td><td>alium</td><td>aliam</td><td>aliud</td></tr>
      <tr><td><b>Abl</b></td><td>aliō</td><td>aliā</td><td>aliō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>aliī</td><td>aliae</td><td>alia</td></tr>
      <tr><td><b>Gen</b></td><td>aliōrum</td><td>aliārum</td><td>aliōrum</td></tr>
      <tr><td><b>Dat</b></td><td>aliīs</td><td>aliīs</td><td>aliīs</td></tr>
      <tr><td><b>Acus</b></td><td>aliōs</td><td>aliās</td><td>alia</td></tr>
      <tr><td><b>Abl</b></td><td>aliīs</td><td>aliīs</td><td>aliīs</td></tr>
    </table>`,
"ullus": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>ūllus</td><td>ūlla</td><td>ūllum</td></tr>
      <tr><td><b>Gen</b></td><td>ūllīus</td><td>ūllīus</td><td>ūllīus</td></tr>
      <tr><td><b>Dat</b></td><td>ūllī</td><td>ūllī</td><td>ūllī</td></tr>
      <tr><td><b>Acus</b></td><td>ūllum</td><td>ūllam</td><td>ūllum</td></tr>
      <tr><td><b>Abl</b></td><td>ūllō</td><td>ūllā</td><td>ūllō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>ūllī</td><td>ūllae</td><td>ūlla</td></tr>
      <tr><td><b>Gen</b></td><td>ūllōrum</td><td>ūllārum</td><td>ūllōrum</td></tr>
      <tr><td><b>Dat</b></td><td>ūllīs</td><td>ūllīs</td><td>ūllīs</td></tr>
      <tr><td><b>Acus</b></td><td>ūllōs</td><td>ūllās</td><td>ūlla</td></tr>
      <tr><td><b>Abl</b></td><td>ūllīs</td><td>ūllīs</td><td>ūllīs</td></tr>
    </table>`,

  "nullus": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>nūllus</td><td>nūlla</td><td>nūllum</td></tr>
      <tr><td><b>Gen</b></td><td>nūllīus</td><td>nūllīus</td><td>nūllīus</td></tr>
      <tr><td><b>Dat</b></td><td>nūllī</td><td>nūllī</td><td>nūllī</td></tr>
      <tr><td><b>Acus</b></td><td>nūllum</td><td>nūllam</td><td>nūllum</td></tr>
      <tr><td><b>Abl</b></td><td>nūllō</td><td>nūllā</td><td>nūllō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>nūllī</td><td>nūllae</td><td>nūlla</td></tr>
      <tr><td><b>Gen</b></td><td>nūllōrum</td><td>nūllārum</td><td>nūllōrum</td></tr>
      <tr><td><b>Dat</b></td><td>nūllīs</td><td>nūllīs</td><td>nūllīs</td></tr>
      <tr><td><b>Acus</b></td><td>nūllōs</td><td>nūllās</td><td>nūlla</td></tr>
      <tr><td><b>Abl</b></td><td>nūllīs</td><td>nūllīs</td><td>nūllīs</td></tr>
    </table>`,
"solus": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>sōlus</td><td>sōla</td><td>sōlum</td></tr>
      <tr><td><b>Gen</b></td><td>sōlīus</td><td>sōlīus</td><td>sōlīus</td></tr>
      <tr><td><b>Dat</b></td><td>sōlī</td><td>sōlī</td><td>sōlī</td></tr>
      <tr><td><b>Acus</b></td><td>sōlum</td><td>sōlam</td><td>sōlum</td></tr>
      <tr><td><b>Abl</b></td><td>sōlō</td><td>sōlā</td><td>sōlō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>sōlī</td><td>sōlae</td><td>sōla</td></tr>
      <tr><td><b>Gen</b></td><td>sōlōrum</td><td>sōlārum</td><td>sōlōrum</td></tr>
      <tr><td><b>Dat</b></td><td>sōlīs</td><td>sōlīs</td><td>sōlīs</td></tr>
      <tr><td><b>Acus</b></td><td>sōlōs</td><td>sōlās</td><td>sōla</td></tr>
      <tr><td><b>Abl</b></td><td>sōlīs</td><td>sōlīs</td><td>sōlīs</td></tr>
    </table>`,

  "totus": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>tōtus</td><td>tōta</td><td>tōtum</td></tr>
      <tr><td><b>Gen</b></td><td>tōtīus</td><td>tōtīus</td><td>tōtīus</td></tr>
      <tr><td><b>Dat</b></td><td>tōtī</td><td>tōtī</td><td>tōtī</td></tr>
      <tr><td><b>Acus</b></td><td>tōtum</td><td>tōtam</td><td>tōtum</td></tr>
      <tr><td><b>Abl</b></td><td>tōtō</td><td>tōtā</td><td>tōtō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>tōtī</td><td>tōtae</td><td>tōta</td></tr>
      <tr><td><b>Gen</b></td><td>tōtōrum</td><td>tōtārum</td><td>tōtōrum</td></tr>
      <tr><td><b>Dat</b></td><td>tōtīs</td><td>tōtīs</td><td>tōtīs</td></tr>
      <tr><td><b>Acus</b></td><td>tōtōs</td><td>tōtās</td><td>tōta</td></tr>
      <tr><td><b>Abl</b></td><td>tōtīs</td><td>tōtīs</td><td>tōtīs</td></tr>
    </table>`,
"uter": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>uter</td><td>utra</td><td>utrum</td></tr>
      <tr><td><b>Gen</b></td><td>utrīus</td><td>utrīus</td><td>utrīus</td></tr>
      <tr><td><b>Dat</b></td><td>utrī</td><td>utrī</td><td>utrī</td></tr>
      <tr><td><b>Acus</b></td><td>utrum</td><td>utram</td><td>utrum</td></tr>
      <tr><td><b>Abl</b></td><td>utrō</td><td>utrā</td><td>utrō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>utrī</td><td>utrae</td><td>utra</td></tr>
      <tr><td><b>Gen</b></td><td>utrōrum</td><td>utrārum</td><td>utrōrum</td></tr>
      <tr><td><b>Dat</b></td><td>utrīs</td><td>utrīs</td><td>utrīs</td></tr>
      <tr><td><b>Acus</b></td><td>utrōs</td><td>utrās</td><td>utra</td></tr>
      <tr><td><b>Abl</b></td><td>utrīs</td><td>utrīs</td><td>utrīs</td></tr>
    </table>`,

  "neuter": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>neuter</td><td>neutra</td><td>neutrum</td></tr>
      <tr><td><b>Gen</b></td><td>neutrīus</td><td>neutrīus</td><td>neutrīus</td></tr>
      <tr><td><b>Dat</b></td><td>neutrī</td><td>neutrī</td><td>neutrī</td></tr>
      <tr><td><b>Acus</b></td><td>neutrum</td><td>neutram</td><td>neutrum</td></tr>
      <tr><td><b>Abl</b></td><td>neutrō</td><td>neutrā</td><td>neutrō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>neutrī</td><td>neutrae</td><td>neutra</td></tr>
      <tr><td><b>Gen</b></td><td>neutrōrum</td><td>neutrārum</td><td>neutrōrum</td></tr>
      <tr><td><b>Dat</b></td><td>neutrīs</td><td>neutrīs</td><td>neutrīs</td></tr>
      <tr><td><b>Acus</b></td><td>neutrōs</td><td>neutrās</td><td>neutra</td></tr>
      <tr><td><b>Abl</b></td><td>neutrīs</td><td>neutrīs</td><td>neutrīs</td></tr>
    </table>`,

  "alter": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR</b></td></tr>
      <tr><td><b>Nom</b></td><td>alter</td><td>altera</td><td>alterum</td></tr>
      <tr><td><b>Gen</b></td><td>alterīus</td><td>alterīus</td><td>alterīus</td></tr>
      <tr><td><b>Dat</b></td><td>alterī</td><td>alterī</td><td>alterī</td></tr>
      <tr><td><b>Acus</b></td><td>alterum</td><td>alteram</td><td>alterum</td></tr>
      <tr><td><b>Abl</b></td><td>alterō</td><td>alterā</td><td>alterō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL</b></td></tr>
      <tr><td><b>Nom</b></td><td>alterī</td><td>alterae</td><td>altera</td></tr>
      <tr><td><b>Gen</b></td><td>alterōrum</td><td>alterārum</td><td>alterōrum</td></tr>
      <tr><td><b>Dat</b></td><td>alterīs</td><td>alterīs</td><td>alterīs</td></tr>
      <tr><td><b>Acus</b></td><td>alterōs</td><td>alterās</td><td>altera</td></tr>
      <tr><td><b>Abl</b></td><td>alterīs</td><td>alterīs</td><td>alterīs</td></tr>
    </table>`,
"unus": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>
      <tr><td colspan="4" style="background:#eee;"><b>SINGULAR (Uno)</b></td></tr>
      <tr><td><b>Nom</b></td><td>ūnus</td><td>ūna</td><td>ūnum</td></tr>
      <tr><td><b>Gen</b></td><td>ūnīus</td><td>ūnīus</td><td>ūnīus</td></tr>
      <tr><td><b>Dat</b></td><td>ūnī</td><td>ūnī</td><td>ūnī</td></tr>
      <tr><td><b>Acus</b></td><td>ūnum</td><td>ūnam</td><td>ūnum</td></tr>
      <tr><td><b>Abl</b></td><td>ūnō</td><td>ūnā</td><td>ūnō</td></tr>
      <tr><td colspan="4" style="background:#eee;"><b>PLURAL (Únicos/Solos)</b></td></tr>
      <tr><td><b>Nom</b></td><td>ūnī</td><td>ūnae</td><td>ūna</td></tr>
      <tr><td><b>Gen</b></td><td>ūnōrum</td><td>ūnārum</td><td>ūnōrum</td></tr>
      <tr><td><b>Dat</b></td><td>ūnīs</td><td>ūnīs</td><td>ūnīs</td></tr>
      <tr><td><b>Acus</b></td><td>ūnōs</td><td>ūnās</td><td>ūna</td></tr>
      <tr><td><b>Abl</b></td><td>ūnīs</td><td>ūnīs</td><td>ūnīs</td></tr>
    </table>`,

  "nemo": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Singular (Nadie)</th></tr>
      <tr><td><b>Nom</b></td><td>nēmō</td></tr>
      <tr><td><b>Gen</b></td><td>nūllīus (nēminis)</td></tr>
      <tr><td><b>Dat</b></td><td>nēminī</td></tr>
      <tr><td><b>Acus</b></td><td>nēminem</td></tr>
      <tr><td><b>Abl</b></td><td>nūllō (nēmine)</td></tr>
    </table>
    <p style="font-size:0.8em; color:grey;">* En Gen. y Abl. se suelen usar formas de <i>nūllus</i>.</p>`,

  "nihil": `
    <table border="1" style="width:100%; text-align:center; border-collapse:collapse; font-size:0.9em;">
      <tr style="background:#ddd;"><th>Caso</th><th>Singular (Nada)</th></tr>
      <tr><td><b>Nom</b></td><td>nihil / nīl</td></tr>
      <tr><td><b>Gen</b></td><td>nūllīus reī</td></tr>
      <tr><td><b>Dat</b></td><td>nūllī reī</td></tr>
      <tr><td><b>Acus</b></td><td>nihil / nīl</td></tr>
      <tr><td><b>Abl</b></td><td>nūllā rē</td></tr>
    </table>
    <p style="font-size:0.8em; color:grey;">* Indeclinable. En casos oblicuos se usa <i>nūlla rēs</i>.</p>`
};

const etiquetasCasos = ["Nom", "Gen", "Dat", "Acus", "Abl", "Voc"];
const etiquetasPersonas = ["1.ª Yo", "2.ª Tú", "3.ª Él/Ella", "1.ª Nosotros", "2.ª Vosotros", "3.ª Ellos"];

// =========================================================
// 3. VARIABLES DE ESTADO Y UTILIDADES
// =========================================================

const inputElement = document.getElementById("paole");
const valueDisplay = document.getElementById("palabra");
const checkDecl = document.getElementById("lbldecl"); 
const checkConj = document.getElementById("lblconj"); 
const divEsquema = document.getElementById("elesq");

let palabraActual = null;

function normalizar(texto) {
  if (!texto) return "";
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// =========================================================
// 4. FUNCIÓN DE BÚSQUEDA (entra) - VERSIÓN CORREGIDA
// =========================================================

function entra() {
  let busqueda = normalizar(inputElement.value).trim();
  
  // Limpieza inicial
  valueDisplay.innerText = "";
  divEsquema.innerHTML = "";
  divEsquema.style.display = "none";
  checkDecl.style.display = "none";
  checkConj.style.display = "none";
  document.getElementById("verdecl").checked = false;
  document.getElementById("verconj").checked = false;
  
  palabraActual = null;

  if (busqueda.length === 0) return;

  for (let item of diccionarioGlobal) {
    let lemaLimpio = normalizar(item.lema);

    if (lemaLimpio.startsWith(busqueda)) {
      
      // A. Mostrar resultado
      valueDisplay.innerText = `${item.lema} (${item.tipo}): ${item.trad}`;
      palabraActual = item;

      // B. REINICIO DE VISIBILIDAD (Bug fix)
      // Apagamos todo antes de decidir qué encender
      checkDecl.style.display = "none";
      checkConj.style.display = "none";

      // C. Encender según tipo
      if (item.tipo === "sustantivo" || item.tipo === "adjetivo" || item.tipo === "pronombre") {
        checkDecl.style.display = "block";
      } 
      else if (item.tipo === "verbo") {
        checkConj.style.display = "block";
      }

      // D. Prioridad exacta
      if (lemaLimpio === busqueda) break;
    }
  }
}

// =========================================================
// 5. CONTROLADOR DE TABLAS (mesq)
// =========================================================

function mesq(checkbox) {
  if (!checkbox.checked || !palabraActual) {
    divEsquema.style.display = "none";
    return;
  }

  divEsquema.innerHTML = "";
  divEsquema.style.display = "block";
  let html = "";

  // ENRUTADOR
  if (palabraActual.tipo === "sustantivo") {
    html = construirTablaSustantivo(palabraActual);
  } else if (palabraActual.tipo === "adjetivo") {
    html = construirTablaAdjetivo(palabraActual);
  } else if (palabraActual.tipo === "verbo") {
    html = construirTablaVerbo(palabraActual);
  } else if (palabraActual.tipo === "pronombre") {
    html = construirTablaPronombre(palabraActual);
  } else {
    html = "<p>Tabla no disponible.</p>";
  }

  divEsquema.innerHTML = html;
}

// =========================================================
// 6. CONSTRUCTORES DE TABLAS
// =========================================================

// --- A. SUSTANTIVOS ---
function construirTablaSustantivo(obj) {
  let sufijos = obtenerSufijos(obj.decl, obj.genero);
  if (!sufijos) return "<h3>Tabla en construcción...</h3>";

  let raiz = obj.raiz.replace("-", "");
  
  // 1. TÍTULO ACTUALIZADO:
  // Capitalizamos la primera letra y agregamos la declinación
  let lemaCap = obj.lema.charAt(0).toUpperCase() + obj.lema.slice(1);
  let html = `<h3>${lemaCap} <span style="font-size:0.8em; font-weight:normal;">(${obj.decl} decl. - ${obj.genero}.)</span></h3>`;
  
  html += `<table border="1" style="width:100%; text-align:center; border-collapse:collapse; background-color:white; color:black;">`;
  html += `<tr style="background:#ddd;"><th>Caso</th><th>Singular</th><th>Plural</th></tr>`;

  for (let i = 0; i < 6; i++) {
    let sg = "";

    // 2. LÓGICA DE EXCEPCIONES (Aquí está la magia para Puer/Ager/Vir):
    
    if (i === 0) {
        // NOMINATIVO: Siempre mostramos el lema tal cual viene en el diccionario.
        // Esto arregla automágicamente 'puer', 'ager', 'vir' y 'dominus'.
        sg = obj.lema; 

    } else if (i === 5) {
        // VOCATIVO:
        // Si es 2.ª y termina en 'us' (dominus) -> se cambia por 'e'.
        // Si no termina en 'us' (puer/ager) -> se queda igual al lema.
        if (obj.decl === "2.ª" && obj.lema.endsWith("us")) {
            sg = raiz + "e"; 
        } else if (obj.decl === "2.ª") {
            sg = obj.lema;   
        } else {
            // Para otras declinaciones, usamos la regla normal
            sg = aplicarSufijo(raiz, sufijos[i], obj.lema);
        }

    } else {
        // RESTO DE CASOS (Gen, Dat, Acu, Abl):
        // Usamos la lógica estándar de sufijos
        sg = aplicarSufijo(raiz, sufijos[i], obj.lema);
    }

    // EL PLURAL (Suele ser regular, así que usamos la lógica normal)
    let pl = aplicarSufijo(raiz, sufijos[i+6], obj.lema);
    
    html += `<tr><td><b>${etiquetasCasos[i]}</b></td><td>${sg}</td><td>${pl}</td></tr>`;
  }
  html += `</table>`;
  return html;
}

// --- B. ADJETIVOS ---
// --- B. ADJETIVOS (CON DESVÍO INTELIGENTE) ---
function construirTablaAdjetivo(obj) {
  
  // 1. LISTA VIP: Adjetivos que se comportan como pronombres (Genitivo en -ius)
  // Si la palabra es una de estas, usamos la tabla que ya hicimos en Pronombres.
  const adjetivosPronominales = ["alter", "unus", "totus", "solus", "ullus", "nullus", "alius", "uter", "neuter"];
  
  if (adjetivosPronominales.includes(obj.lema) || adjetivosPronominales.includes(obj.raiz)) {
    return construirTablaPronombre(obj); 
  }

  // 2. LÓGICA ESTÁNDAR (Para bonus, miser, acer...)
  let sufMas, sufFem, sufNeu;

  if (obj.decl === "1.ª y 2.ª") {
    sufMas = terminaciones["2.ª"].m; 
    sufFem = terminaciones["1.ª"].sufijos; 
    sufNeu = terminaciones["2.ª"].n; 
  } else if (obj.decl.includes("3.ª")) {
    sufMas = terminaciones["3.ª"].m_f;
    sufFem = terminaciones["3.ª"].m_f; 
    sufNeu = terminaciones["3.ª"].n;
  } else {
    return "<h3>Tabla compleja (Irregular)</h3>";
  }

  let raiz = obj.raiz.replace("-", "");
  let html = `<h3>${obj.lema}</h3>`;
  html += `<table border="1" style="width:100%; text-align:center; border-collapse:collapse; background-color:white; color:black; font-size:0.9em;">`;
  html += `<tr style="background:#ddd;"><th>Caso</th><th>Masc.</th><th>Fem.</th><th>Neut.</th></tr>`;

  const etiquetasCompletas = [...etiquetasCasos.map(c=>c+" Sg"), ...etiquetasCasos.map(c=>c+" Pl")];

  for (let i = 0; i < 12; i++) {
    if (i === 6) html += `<tr style="background:#eee;"><td colspan="4"><b>PLURAL</b></td></tr>`;

    let m = aplicarSufijo(raiz, sufMas[i], obj.lema);
    let f = aplicarSufijo(raiz, sufFem[i], obj.lema);
    let n = aplicarSufijo(raiz, sufNeu[i], obj.lema);
    
    html += `<tr><td><b>${etiquetasCompletas[i]}</b></td><td>${m}</td><td>${f}</td><td>${n}</td></tr>`;
  }
  html += `</table>`;
  return html;
}

// --- C. VERBOS ---
function construirTablaVerbo(obj) {
  let sufijos = conjugaciones[obj.conj];
  if (!sufijos) return `<h3>${obj.lema}: Conjugación ${obj.conj} no implementada.</h3>`;

  let raiz = obj.raiz.replace("-", "");
  let html = `<h3>${obj.lema} Presente. ${obj.conj} Conj.</h3>`;
  html += `<table border="1" style="width:100%; text-align:center; border-collapse:collapse; background-color:white; color:black;">`;
  html += `<tr style="background:#ddd;"><th>Persona</th><th>Forma</th></tr>`;

  for (let i = 0; i < 6; i++) {
    let forma = "";
    
    // --- LÓGICA ACTUALIZADA ---
    // Si es 1.ª (ama-), 2.ª (habe-) o 4.ª (audi-), quitamos la última letra 
    // de la raíz para que no choque con la vocal del sufijo.
    if (obj.conj === "1.ª" || obj.conj === "2.ª" || obj.conj === "4.ª") {
        forma = raiz.slice(0, -1) + sufijos[i];
        
    } else {
        // Para la 3.ª (reg-) y Mixta (cap-), pegamos directo porque la raíz acaba en consonante
        forma = raiz + sufijos[i];
    }

    // Irregulares mandan sobre todo lo anterior
    if (obj.conj === "Irregular" || obj.conj === "Defectivo") {
        forma = sufijos[i]; 
    }
    
    html += `<tr><td><b>${etiquetasPersonas[i]}</b></td><td>${forma}</td></tr>`;
  }
  html += `</table>`;
  return html;
}

// --- D. PRONOMBRES (BLINDADO) ---
function construirTablaPronombre(obj) {
  
  // 1. Definimos las posibles claves de búsqueda
  // K1: La raíz limpia (sin guiones). Ej: "hic" (de hanc), "alter" (de alter-)
  let k1 = obj.raiz ? obj.raiz.replace(/-/g, "").trim() : "";
  
  // K2: El lema directo. Ej: "alter", "totus", "ego"
  let k2 = obj.lema ? obj.lema.trim() : "";

  // 2. Intentamos pescar la tabla con cualquiera de las dos llaves
  // Primero prueba la raíz, si no existe, prueba el lema.
  let tablaHTML = tablasPronombres[k1] || tablasPronombres[k2];

  if (tablaHTML) {
    // Encontramos la tabla (usando k1 o k2)
    let titulo = k1 || k2; // Para ponerlo en el título
    return `<h3>Pronombre/Adj: ${titulo} (${obj.decl})</h3>` + tablaHTML;
  } else {
    // No hubo suerte
    return `<h3>${obj.lema}</h3>
            <p>Esquema para tipo <b>${obj.decl}</b> en construcción.</p>
            <p style="font-size:0.8em; color:red;">Debug: Busqué claves "${k1}" y "${k2}"</p>`;
  }
}

// =========================================================
// 7. HELPERS
// =========================================================
function obtenerSufijos(decl, genero) {
  if (decl === "1.ª") return terminaciones["1.ª"].sufijos;
  if (decl === "5.ª") return terminaciones["5.ª"].m_f;
  if (decl === "2.ª") return (genero === "n") ? terminaciones["2.ª"].n : terminaciones["2.ª"].m;
  if (decl === "3.ª") return (genero === "n") ? terminaciones["3.ª"].n : terminaciones["3.ª"].m_f;
  if (decl === "4.ª") return (genero === "n") ? terminaciones["4.ª"].n : terminaciones["4.ª"].m_f;
  return null;
}

function aplicarSufijo(raiz, sufijo, lema) {
  if (sufijo === "*") return `<b>${lema}</b>`;
  return raiz + sufijo;

}

