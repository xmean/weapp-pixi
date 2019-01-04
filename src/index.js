import WPX from './core/wpx';
import SYSTEM from './core/system';
import Page from './core/page';

import Tween from './tween/tween';
import ResLoader from './loader/loader';
import UI from './ui/index';

import Prebuild from './model/prebuild';
import ModelPool from './model/pool';

import DrawUtils from './utils/drawutils';
import MathUtils from './utils/mathutils';

// namespace

WPX.Page = Page;
WPX.SYSTEM = SYSTEM;
WPX.ResLoader = ResLoader;
WPX.UI = UI;
WPX.Tween = Tween;

WPX.Prebuild = Prebuild;
WPX.ModelPool = ModelPool;

WPX.DrawUtils = DrawUtils;
WPX.MathUtils = MathUtils;

// shortcut functions

WPX.dp = (v) => {
    return WPX.SYSTEM.dp(v);
};

export default WPX;