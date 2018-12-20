import View from "./view/view";
import ViewError from "./view/viewerror";
import ImageView from "./view/imageview";
import ImageButton from "./view/imagebutton";
import Dialog from "./view/dialog";
import Button from "./view/button";
import TextView from "./view/textview";

import ListView from "./scrollable/listview";
import ScrollView from "./scrollable/scrollview";

import Page from "./page/page";
import PageManager from "./page/pagemanager";

import Layout from "./layout/layout";
import LinearLayout from "./layout/linearlayout";
import GridLayout from "./layout/gridlayout";

class UI {

}

// namespace

UI.View = View;
UI.ViewError = ViewError;
UI.ImageView = ImageView;
UI.ImageButton = ImageButton;
UI.Dialog = Dialog;
UI.Button = Button;
UI.TextView = TextView;

UI.ListView = ListView;
UI.ScrollView = ScrollView;

UI.PageManager = PageManager;
UI.Page = Page;

UI.Layout = Layout;
UI.LinearLayout = LinearLayout;
UI.GridLayout = GridLayout;

export default UI;
