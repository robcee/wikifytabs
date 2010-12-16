/*
 * WikifyTabs
 * Provide convenient, copyable lists of open tabs per browser window.
 * Author: Rob Campbell <rob@antennasoft.net>
 * Versions:
 *   1.0 - Added submenus and bbcode, HTML options.
 *
 * All Copyright Dedicated to the Public Domain 2010.
 */

var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

const WIKI = 1;
const BBCODE = 2;
const HTML = 3;

var html =
  "<h1 style='font: 24px/26px sans-serif'>Links for Tabs</h1>\n" +
  "<pre style='border: 2px solid #333; border-radius: 4px; margin: 12px; padding: 8px;'>$2</pre>";

function url(spec) {
  return ios.newURI(spec, null, null);
}

function getTabUris() {
  _log("getTabUris");
  let tabList = [];

  let browsers = gBrowser.browsers;
  for (let i = 0; i < browsers.length - 1; ++i) {
    try {
      let bUri = browsers[i].webNavigation.currentURI.spec;
      let bTitle = browsers[i].contentDocument.title
      let uriTitlePair = [bUri, bTitle];
      tabList.push(uriTitlePair);
    } catch (e) { }
  }
  return tabList;
}

function onTabOpen() {
  _log("onTabOpen");
  let tabList = getTabUris();
  let textContent = new String(html);
  let tabText = new String();

  for (let i = 0; i < tabList.length; i++)
    tabText += "* [" + tabList[i][0] + " " + tabList[i][1] + "]\n";

  _log("tabText: " + tabText);

  gBrowser.contentDocument.title = "WikifiedTabs";

  textContent = textContent.replace("$2", tabText);
  _log("textContent: " + textContent);

  gBrowser.contentDocument.body.innerHTML = textContent;
}

function writeTabsInText() {
  _log("writeTabsInText");
  gBrowser.selectedTab = gBrowser.addTab();
  gBrowser.selectedBrowser.addEventListener("load", function() {
    gBrowser.selectedBrowser.removeEventListener("load", arguments.callee, true);
    _log("load listener");
    setTimeout(onTabOpen, 5);
  }, true);
}

function _log(msg) {
  Services.console.logStringMessage("LOG: " + msg);
}