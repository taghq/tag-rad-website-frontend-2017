/**
 * @overview Browser detection

───────▄█──────────█─────────█▄───────
─────▐██──────▄█──███──█▄─────██▌─────
────▐██▀─────█████████████────▀██▌────
───▐██▌─────██████████████─────▐██▌───
───████────████████████████────████───
──▐█████──██████████████████──█████▌──
───████████████████████████████████───
────███████▀▀████████████▀▀███████────
─────█████▌──▄▄─▀████▀─▄▄──▐█████─────
───▄▄██████▄─▀▀──████──▀▀─▄██████▄▄───
──██████████████████████████████████──
─████████████████████████████████████─
▐██████──███████▀▄██▄▀███████──██████▌
▐█████────██████████████████────█████▌
▐█████─────██████▀──▀██████─────█████▌
─█████▄─────███────────███─────▄█████─
──██████─────█──────────█─────██████──
────█████────────────────────█████────
─────█████──────────────────█████─────
──────█████────────────────█████──────
───────████───▄────────▄───████───────
────────████─██────────██─████────────
────────████████─▄██▄─████████────────
───────████████████████████████───────
───────████████████████████████───────
────────▀█████████▀▀█████████▀────────
──────────▀███▀────────▀███▀──────────

 */
import addClass from 'dom-helpers/class/addClass';
import bowser from 'bowser';



const PREFIX = 'b-';
const version = parseInt(bowser.version, 10);


// bowser.blink && addClass(document.documentElement, PREFIX + 'blink');
// bowser.gecko && addClass(document.documentElement, 'browser-gecko');
bowser.msie && addClass(document.documentElement, PREFIX + 'msie');
bowser.msie && version === 9 && addClass(document.documentElement, PREFIX + 'msie-9');
bowser.msie && version < 9 && addClass(document.documentElement, PREFIX + 'msie-old');
// bowser.msedge && addClass(document.documentElement, PREFIX + 'msedge');
// bowser.webkit && addClass(document.documentElement, PREFIX + 'webkit');
bowser.tablet && addClass(document.documentElement, PREFIX + 'tablet');
bowser.mobile && addClass(document.documentElement, PREFIX + 'mobile');



export default bowser;
