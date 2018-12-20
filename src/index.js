import WPX from "./core/wpx";
import SYSTEM from "./core/system";

import Tween from "./tween/tween";
import ResLoader from "./loader/loader";
import UI from "./ui/index";

import DrawUtils from "./utils/drawutils";
import MathUtils from "./utils/mathutils";

// namespace

WPX.SYSTEM = SYSTEM;
WPX.ResLoader = ResLoader;
WPX.UI = UI;
WPX.Tween = Tween;
WPX.DrawUtils = DrawUtils;
WPX.MathUtils = MathUtils;

export default WPX;