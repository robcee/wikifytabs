var gWikifyTabs;

function url(spec) {
  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  return ios.newURI(spec, null, null);
}

function _getTabUris() {
    var tabList = [];

    var browsers = gBrowser.browsers;
    for (var i = 0; i < browsers.length; ++i) {
        try {
            var bUri = browsers[i].webNavigation.currentURI.spec;
            var bTitle = browsers[i].contentDocument.title
            var uriTitlePair = [bUri, bTitle];
            tabList.push(uriTitlePair);
        } catch (e) { }
    }
    return tabList;
}

function onTabOpen(tabs) {
    var tabList = _getTabUris();
    var textContent = "<h1>copy the links below to your wiki</h1>\n<pre>";
    for (var i = 0; i < tabList.length; i++) {
        textContent += "* [" + tabList[i][0] + " " + tabList[i][1] + "]\n";
    }
    textContent += "</pre>";
    gBrowser.contentDocument.title = "WikifiedTabs";
    gBrowser.contentDocument.body.innerHTML = textContent;
}

function writeTabsInText() {
    newTab = gBrowser.addTab();
    gBrowser.selectedTab = newTab;
    gBrowser.focus();
    var newBrowser = gBrowser.getBrowserForTab(newTab);
    newBrowser.addEventListener("load", onTabOpen, true);
}

function onWikifyTabsLoad() {
    // do initialization here
    gWikifyTabs = "loaded";
}

//Make sure we load on start-up of browser.
window.addEventListener('load', onWikifyTabsLoad, false);