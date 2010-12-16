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
  "<h1 style='font: 14em/16em sans-serif'>Here are your links</h1>\n" +
  "<pre style='border: 2px solid #333; border-radius: 4px;'>$2</pre>";

function url(spec) {
  return ios.newURI(spec, null, null);
}

function getTabUris() {
  let tabList = [];

  let browsers = gBrowser.browsers;
  for (let i = 0; i < browsers.length; ++i) {
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
  gBrowser.selectedBrowser.removeEventListener("load", onTabOpen, false);
  let tabList = getTabUris();
  let textContent = new String(html);
  let tabText = new String();

  for (let i = 0; i < tabList.length; i++)
    tabText += "* [" + tabList[i][0] + " " + tabList[i][1] + "]\n";

  gBrowser.contentDocument.title = "WikifiedTabs";

  textContent.replace("$2", tabText);

  gBrowser.contentDocument.body.innerHTML = textContent;
}

function writeTabsInText() {
  let newTab = gBrowser.addTab();
  gBrowser.selectedTab = newTab;
  // gBrowser.focus();
  let newBrowser = gBrowser.getBrowserForTab(newTab);
  newBrowser.addEventListener("load", onTabOpen, false);
}
