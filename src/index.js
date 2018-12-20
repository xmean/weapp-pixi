import WPX from "./core/wpx.js";
import SYSTEM from "/core/system.js";

import Tween from "./tween/tween.js";
import ResLoader from "./loader/loader.js";
import UI from "./ui/index.js";

import DrawUtils from "./utils/drawutils.js";
import MathUtils from "./utils/mathutils.js";

// namespace

WPX.SYSTEM = SYSTEM;
WPX.ResLoader = ResLoader;
WPX.UI = UI;
WPX.Tween = Tween;
WPX.DrawUtils = DrawUtils;
WPX.MathUtils = MathUtils;

export default WPX;