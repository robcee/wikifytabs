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

var gWikifyMode = 0;

const WIKI = 1;
const BBCODE = 2;
const HTML = 3;

var html =
  "<h1 style='font: 24px/26px sans-serif'>Links for Tabs</h1>\n" +
  "<div style='font: 12px/14px sans-serif; border: 2px solid #333; " +
  "border-radius: 4px; margin: 12px; padding: 8px; overflow-x: auto;'>$2</div>";

function url(spec) {
  return ios.newURI(spec, null, null);
}

function getTabUris() {
  let tabList = [];

  let browsers = gBrowser.browsers;
  for (let i = 0; i < browsers.length - 1; ++i) {
    try {
      let bUri = browsers[i].webNavigation.currentURI.spec;
      let bTitle = browsers[i].contentDocument.title;
      let uriTitlePair = [bUri, bTitle];
      tabList.push(uriTitlePair);
    } catch (e) { }
  }
  return tabList;
}

function onTabOpen() {
  let tabList = getTabUris();
  let textContent = new String(html);
  let tabText = new String();

  switch(gWikifyMode) {
    case WIKI:
      for (let i = 0; i < tabList.length; i++)
        tabText += "* [" + tabList[i][0] + " " + tabList[i][1] + "]<br/>\n";
      break;
    case BBCODE:
      for (let i = 0; i < tabList.length; i++)
        tabText += "* [url=" + tabList[i][0] + "]" + tabList[i][1] + "[/url]<br/>\n";
      break;
    case HTML:
      for (let i = 0; i < tabList.length; i++)
        tabText += "* &lt;a href=\"" + tabList[i][0] + "\"&gt;" + tabList[i][1] + "&lt;a&gt;<br/>\n";
      break;
  }

  gBrowser.contentDocument.title = "WikifiedTabs";

  textContent = textContent.replace("$2", tabText);

  gBrowser.contentDocument.body.innerHTML = textContent;
}

function createTabAndWrite() {
  gBrowser.selectedTab = gBrowser.addTab();
  gBrowser.selectedBrowser.addEventListener("load", function() {
    gBrowser.selectedBrowser.removeEventListener("load", arguments.callee, true);
    onTabOpen();
  }, true);
}

function writeHTMLTabsInText() {
  gWikifyMode = HTML;
  createTabAndWrite();
}

function writeBBCodeTabsInText() {
  gWikifyMode = BBCODE;
  createTabAndWrite();
}

function writeTabsInText() {
  gWikifyMode = WIKI;
  createTabAndWrite();
}
