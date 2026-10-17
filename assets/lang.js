// Japanese is the default language. ?lang=vi (or the switch) selects Vietnamese and is remembered.
(function () {
  var SUPPORTED = ["ja", "vi"];
  var KEY = "aigym-lang";

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(lang, remember) {
    if (SUPPORTED.indexOf(lang) < 0) lang = "ja";
    var root = document.documentElement;
    root.lang = lang;
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", buttons[i].getAttribute("data-set-lang") === lang ? "true" : "false");
    }
    var links = document.querySelectorAll("a[data-keep-lang]");
    for (var j = 0; j < links.length; j++) {
      var base = links[j].getAttribute("href").split("?")[0];
      links[j].setAttribute("href", lang === "ja" ? base : base + "?lang=" + lang);
    }
    if (remember) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
    }
  }

  var param = new URLSearchParams(location.search).get("lang");
  apply(param || stored() || "ja", !!param);

  document.addEventListener("DOMContentLoaded", function () {
    apply(document.documentElement.lang, false);
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-set-lang]");
      if (!button) return;
      var lang = button.getAttribute("data-set-lang");
      apply(lang, true);
      var url = new URL(location.href);
      if (lang === "ja") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    });
  });
})();
