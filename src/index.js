import WPX from "./core/wpx";
import SYSTEM from "./core/system";
import Page from "./core/page";

import Tween from "./tween/tween";
import ResLoader from "./loader/loader";
import UI from "./ui/index";

import DrawUtils from "./utils/drawutils";
import MathUtils from "./utils/mathutils";

// namespace

WPX.Page = Page;
WPX.SYSTEM = SYSTEM;
WPX.ResLoader = ResLoader;
WPX.UI = UI;
WPX.Tween = Tween;
WPX.DrawUtils = DrawUtils;
WPX.MathUtils = MathUtils;

// shortcut functions

WPX.dp = (v) => {
    return WPX.SYSTEM.dp(v);
};

export default WPX;