"use strict";
const modules_flsModules = {};
// Допоміжні функції, які використовуються
function getHash() {
  if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split("#")[0];
  history.pushState("", "", hash);
}
let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(
        new CustomEvent("slideUpDone", {
          detail: {
            target,
          },
        })
      );
    }, duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(
        new CustomEvent("slideDownDone", {
          detail: {
            target,
          },
        })
      );
    }, duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration);
  else return _slideUp(target, duration);
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
  else bodyLock(delay);
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue =
      window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
//////////////////////////////////////////////////////

// Функція споллерів
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(function (
      item,
      index,
      self
    ) {
      return !item.dataset.spollers.split(",")[0];
    });
    if (spollersRegular.length) initSpollers(spollersRegular);
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length)
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length)
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("_spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("_spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const scrollSpoller = spollerBlock.hasAttribute(
            "data-spoller-scroll"
          );
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerBlock.open)
              hideSpollersBody(spollersBlock);
            !spollerBlock.open
              ? (spollerBlock.open = true)
              : setTimeout(() => {
                  spollerBlock.open = false;
                }, spollerSpeed);
            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (
              scrollSpoller &&
              spollerTitle.classList.contains("_spoller-active")
            ) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue
                ? +scrollSpollerValue
                : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute(
                "data-spoller-scroll-noheader"
              )
                ? document.querySelector(".header").offsetHeight
                : 0;
              window.scrollTo({
                top:
                  spollerBlock.offsetTop -
                  (scrollSpollerOffset + scrollSpollerNoHeader),
                behavior: "smooth",
              });
            }
          }
        }
      }
      if (!el.closest("[data-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length)
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("_spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed
                ? parseInt(spollersBlock.dataset.spollersSpeed)
                : 500;
              spollerClose.classList.remove("_spoller-active");
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (
        spollerActiveBlock &&
        !spollersBlock.querySelectorAll("._slide").length
      ) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed
          ? parseInt(spollersBlock.dataset.spollersSpeed)
          : 500;
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    }
  }
}
// Функція табів
function tabs() {
  const tabs = document.querySelectorAll("[data-tabs]");
  let tabsActiveHash = [];
  let scrollBlockHeight = 210;
  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith("tab-"))
      tabsActiveHash = hash.replace("tab-", "").split("-");
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add("_tab-init");
      tabsBlock.setAttribute("data-tabs-index", index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length)
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
  }
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach((tabsMediaItem) => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
      let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
      let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
      let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
      tabsTitleItems = Array.from(tabsTitleItems).filter(
        (item) => item.closest("[data-tabs]") === tabsMediaItem
      );
      tabsContentItems = Array.from(tabsContentItems).filter(
        (item) => item.closest("[data-tabs]") === tabsMediaItem
      );
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add("_tab-spoller");
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove("_tab-spoller");
        }
      });
    });
  }
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
    let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector(
        "[data-tabs-titles]>._tab-active"
      );
      tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
    }
    if (tabsContent.length)
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute("data-tabs-title", "");
        tabsContentItem.setAttribute("data-tabs-item", "");
        if (tabsActiveHashBlock && index == tabsActiveHash[1])
          tabsTitles[index].classList.add("_tab-active");
        tabsContentItem.hidden =
          !tabsTitles[index].classList.contains("_tab-active");
      });
  }
  function scrollToTopOfElement(elementBlock, height) {
    if (elementBlock) {
      const offset = elementBlock.offsetTop - height;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
    let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute("data-tabs-animate"))
        return tabsBlock.dataset.tabsAnimate > 0
          ? Number(tabsBlock.dataset.tabsAnimate)
          : 500;
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute("data-tabs-hash");
      tabsContent = Array.from(tabsContent).filter(
        (item) => item.closest("[data-tabs]") === tabsBlock
      );
      tabsTitles = Array.from(tabsTitles).filter(
        (item) => item.closest("[data-tabs]") === tabsBlock
      );
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains("_tab-active")) {
          if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate);
          else {
            tabsContentItem.hidden = false;
            if (tabsBlock.closest("[data-tabs-scroll]"))
              scrollToTopOfElement(tabsContentItem, scrollBlockHeight);
          }
          if (isHash && !tabsContentItem.closest(".popup"))
            setHash(`tab-${tabsBlockIndex}-${index}`);
        } else if (tabsBlockAnimate)
          _slideUp(tabsContentItem, tabsBlockAnimate);
        else tabsContentItem.hidden = true;
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest("[data-tabs-title]")) {
      const tabTitle = el.closest("[data-tabs-title]");
      const tabsBlock = tabTitle.closest("[data-tabs]");
      if (
        !tabTitle.classList.contains("_tab-active") &&
        !tabsBlock.querySelector("._slide")
      ) {
        let tabActiveTitle = tabsBlock.querySelectorAll(
          "[data-tabs-title]._tab-active"
        );
        tabActiveTitle.length
          ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
              (item) => item.closest("[data-tabs]") === tabsBlock
            ))
          : null;
        tabActiveTitle.length
          ? tabActiveTitle[0].classList.remove("_tab-active")
          : null;
        tabTitle.classList.add("_tab-active");
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
// Функція меню
function menuInit() {
  if (document.querySelector(".icon-menu"))
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest(".icon-menu")) {
        bodyLockToggle();
        document.documentElement.classList.toggle("menu-open");
      }
      if (
        !e.target.closest(".icon-menu") &&
        !e.target.closest(".menu__body") &&
        !e.target.closest(".popup__content") &&
        !e.target.closest(".aside-block")
      )
        menuClose();
    });
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}
// Функція "Показати більше"
function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll("[data-showmore]");
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (
        item,
        index,
        self
      ) {
        return !item.dataset.showmoreMedia;
      });
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach((mdQueriesItem) => {
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach((showMoreBlock) => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll(
        "[data-showmore-content]"
      );
      let showMoreButton = showMoreBlock.querySelectorAll(
        "[data-showmore-button]"
      );
      showMoreContent = Array.from(showMoreContent).filter(
        (item) => item.closest("[data-showmore]") === showMoreBlock
      )[0];
      showMoreButton = Array.from(showMoreButton).filter(
        (item) => item.closest("[data-showmore]") === showMoreBlock
      )[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia)
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(
            showMoreContent,
            0,
            showMoreBlock.classList.contains("_showmore-active")
              ? getOriginalHeight(showMoreContent)
              : hiddenHeight
          );
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore
        ? showMoreBlock.dataset.showmore
        : "size";
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap)
        ? parseFloat(getComputedStyle(showMoreContent).rowGap)
        : 0;
      if (showMoreType === "items") {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent
          ? showMoreContent.dataset.showmoreContent
          : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop)
            ? parseFloat(getComputedStyle(showMoreItem).marginTop)
            : 0;
          const marginBottom = parseFloat(
            getComputedStyle(showMoreItem).marginBottom
          )
            ? parseFloat(getComputedStyle(showMoreItem).marginBottom)
            : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? (hiddenHeight += (showMoreTypeValue - 1) * rowGap) : null;
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent
          ? showMoreContent.dataset.showmoreContent
          : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }
    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty("height");
      if (showMoreContent.closest(`[hidden]`)) {
        parentHidden = showMoreContent.closest(`[hidden]`);
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? (parentHidden.hidden = true) : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === "click") {
        if (targetEvent.closest("[data-showmore-button]")) {
          const showMoreButton = targetEvent.closest("[data-showmore-button]");
          const showMoreBlock = showMoreButton.closest("[data-showmore]");
          const showMoreContent = showMoreBlock.querySelector(
            "[data-showmore-content]"
          );
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton
            ? showMoreBlock.dataset.showmoreButton
            : "500";
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains("_slide")) {
            showMoreBlock.classList.contains("_showmore-active")
              ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
              : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle("_showmore-active");
          }
        }
      } else if (targetType === "resize") {
        showMoreBlocksRegular && showMoreBlocksRegular.length
          ? initItems(showMoreBlocksRegular)
          : null;
        mdQueriesArray && mdQueriesArray.length
          ? initItemsMedia(mdQueriesArray)
          : null;
      }
    }
  });
}

function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) array[i].classList.remove(className);
}
function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue])
      return item.dataset[dataSetValue].split(",")[0];
  });
  if (media.length) {
    const breakpointsArray = [];
    media.forEach((item) => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    let mdQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width: " +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      );
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      mdQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType)
            return true;
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia,
        });
      });
      return mdQueriesArray;
    }
  }
}
// Обробка цифр (wNumb)
!(function (e) {
  "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (module.exports = e())
    : (window.wNumb = e());
})(function () {
  "use strict";
  var o = [
    "decimals",
    "thousand",
    "mark",
    "prefix",
    "suffix",
    "encoder",
    "decoder",
    "negativeBefore",
    "negative",
    "edit",
    "undo",
  ];
  function w(e) {
    return e.split("").reverse().join("");
  }
  function h(e, t) {
    return e.substring(0, t.length) === t;
  }
  function f(e, t, n) {
    if ((e[t] || e[n]) && e[t] === e[n]) throw new Error(t);
  }
  function x(e) {
    return "number" == typeof e && isFinite(e);
  }
  function n(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l,
      h,
      g = p,
      v = "",
      m = "";
    return (
      o && (p = o(p)),
      !!x(p) &&
        (!1 !== e && 0 === parseFloat(p.toFixed(e)) && (p = 0),
        p < 0 && ((d = !0), (p = Math.abs(p))),
        !1 !== e &&
          (p = (function (e, t) {
            return (
              (e = e.toString().split("e")),
              (+(
                (e = (e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] + t : t))))
                  .toString()
                  .split("e"))[0] +
                "e" +
                (e[1] ? e[1] - t : -t)
              )).toFixed(t)
            );
          })(p, e)),
        -1 !== (p = p.toString()).indexOf(".")
          ? ((h = (l = p.split("."))[0]), n && (v = n + l[1]))
          : (h = p),
        t && (h = w((h = w(h).match(/.{1,3}/g)).join(w(t)))),
        d && u && (m += u),
        r && (m += r),
        d && s && (m += s),
        (m += h),
        (m += v),
        i && (m += i),
        c && (m = c(m, g)),
        m)
    );
  }
  function r(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l = "";
    return (
      a && (p = a(p)),
      !(!p || "string" != typeof p) &&
        (u && h(p, u) && ((p = p.replace(u, "")), (d = !0)),
        r && h(p, r) && (p = p.replace(r, "")),
        s && h(p, s) && ((p = p.replace(s, "")), (d = !0)),
        i &&
          (function (e, t) {
            return e.slice(-1 * t.length) === t;
          })(p, i) &&
          (p = p.slice(0, -1 * i.length)),
        t && (p = p.split(t).join("")),
        n && (p = p.replace(n, ".")),
        d && (l += "-"),
        "" !== (l = (l += p).replace(/[^0-9\.\-.]/g, "")) &&
          ((l = Number(l)), f && (l = f(l)), !!x(l) && l))
    );
  }
  function i(e, t, n) {
    var r,
      i = [];
    for (r = 0; r < o.length; r += 1) i.push(e[o[r]]);
    return i.push(n), t.apply("", i);
  }
  return function e(t) {
    if (!(this instanceof e)) return new e(t);
    "object" == typeof t &&
      ((t = (function (e) {
        var t,
          n,
          r,
          i = {};
        for (
          void 0 === e.suffix && (e.suffix = e.postfix), t = 0;
          t < o.length;
          t += 1
        )
          if (void 0 === (r = e[(n = o[t])]))
            "negative" !== n || i.negativeBefore
              ? "mark" === n && "." !== i.thousand
                ? (i[n] = ".")
                : (i[n] = !1)
              : (i[n] = "-");
          else if ("decimals" === n) {
            if (!(0 <= r && r < 8)) throw new Error(n);
            i[n] = r;
          } else if (
            "encoder" === n ||
            "decoder" === n ||
            "edit" === n ||
            "undo" === n
          ) {
            if ("function" != typeof r) throw new Error(n);
            i[n] = r;
          } else {
            if ("string" != typeof r) throw new Error(n);
            i[n] = r;
          }
        return (
          f(i, "mark", "thousand"),
          f(i, "prefix", "negative"),
          f(i, "prefix", "negativeBefore"),
          i
        );
      })(t)),
      (this.to = function (e) {
        return i(t, n, e);
      }),
      (this.from = function (e) {
        return i(t, r, e);
      }));
  };
});
// Модуль попапів
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show",
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        location: false,
        goHash: false,
      },
      on: {
        beforeOpen: function () {},
        afterOpen: function () {},
        beforeClose: function () {},
        afterClose: function () {},
      },
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false,
    };
    this.previousOpen = {
      selector: false,
      element: false,
    };
    this.lastClosed = {
      selector: false,
      element: false,
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = [
      "a[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "button:not([disabled]):not([aria-hidden])",
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes,
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings,
      },
      on: {
        ...config.on,
        ...options?.on,
      },
    };
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.popupLogging(`Прокинувся`);
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener(
      "click",
      function (e) {
        const buttonOpen = e.target.closest(
          `[${this.options.attributeOpenButton}]`
        );
        if (buttonOpen) {
          e.preventDefault();
          this._dataValue = buttonOpen.getAttribute(
            this.options.attributeOpenButton
          )
            ? buttonOpen.getAttribute(this.options.attributeOpenButton)
            : "error";
          this.youTubeCode = buttonOpen.getAttribute(
            this.options.youtubeAttribute
          )
            ? buttonOpen.getAttribute(this.options.youtubeAttribute)
            : null;
          if (this._dataValue !== "error") {
            if (!this.isOpen) this.lastFocusEl = buttonOpen;
            this.targetOpen.selector = `${this._dataValue}`;
            this._selectorOpen = true;
            this.open();
            return;
          } else
            this.popupLogging(
              `Йой, не заповнено атрибут у ${buttonOpen.classList}`
            );
          return;
        }
        const buttonClose = e.target.closest(
          `[${this.options.attributeCloseButton}]`
        );
        if (
          buttonClose ||
          (!e.target.closest(`.${this.options.classes.popupContent}`) &&
            this.isOpen)
        ) {
          e.preventDefault();
          this.close();
          return;
        }
      }.bind(this)
    );
    document.addEventListener(
      "keydown",
      function (e) {
        if (
          this.options.closeEsc &&
          e.which == 27 &&
          e.code === "Escape" &&
          this.isOpen
        ) {
          e.preventDefault();
          this.close();
          return;
        }
        if (this.options.focusCatch && e.which == 9 && this.isOpen) {
          this._focusCatch(e);
          return;
        }
      }.bind(this)
    );
    if (this.options.hashSettings.goHash) {
      window.addEventListener(
        "hashchange",
        function () {
          if (window.location.hash) this._openToHash();
          else this.close(this.targetOpen.selector);
        }.bind(this)
      );
      window.addEventListener(
        "load",
        function () {
          if (window.location.hash) this._openToHash();
        }.bind(this)
      );
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock =
        document.documentElement.classList.contains("lock") && !this.isOpen
          ? true
          : false;
      if (
        selectorValue &&
        typeof selectorValue === "string" &&
        selectorValue.trim() !== ""
      ) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen)
        this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(
        this.targetOpen.selector
      );
      if (this.targetOpen.element) {
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (
            !this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            )
          ) {
            this.targetOpen.element
              .querySelector(".popup__text")
              .setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element
            .querySelector(`[${this.options.youtubePlaceAttribute}]`)
            .appendChild(iframe);
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(
          new CustomEvent("beforePopupOpen", {
            detail: {
              popup: this,
            },
          })
        );
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null;
        else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(
          new CustomEvent("afterPopupOpen", {
            detail: {
              popup: this,
            },
          })
        );
        this.popupLogging(`Відкрив попап`);
      } else
        this.popupLogging(
          `Йой, такого попапу немає. Перевірте коректність введення. `
        );
    }
  }
  close(selectorValue) {
    if (
      selectorValue &&
      typeof selectorValue === "string" &&
      selectorValue.trim() !== ""
    )
      this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(
      new CustomEvent("beforePopupClose", {
        detail: {
          popup: this,
        },
      })
    );
    if (this.youTubeCode)
      if (
        this.targetOpen.element.querySelector(
          `[${this.options.youtubePlaceAttribute}]`
        )
      )
        this.targetOpen.element.querySelector(
          `[${this.options.youtubePlaceAttribute}]`
        ).innerHTML = "";
    this.previousOpen.element.classList.remove(
      this.options.classes.popupActive
    );
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(
        this.options.classes.bodyActive
      );
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(
      new CustomEvent("afterPopupClose", {
        detail: {
          popup: this,
        },
      })
    );
    setTimeout(() => {
      this._focusTrap();
    }, 50);
    this.popupLogging(`Закрив попап`);
  }
  _getHash() {
    if (this.options.hashSettings.location)
      this.hash = this.targetOpen.selector.includes("#")
        ? this.targetOpen.selector
        : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(
      `.${window.location.hash.replace("#", "")}`
    )
      ? `.${window.location.hash.replace("#", "")}`
      : document.querySelector(`${window.location.hash}`)
      ? `${window.location.hash}`
      : null;
    const buttons = document.querySelector(
      `[${this.options.attributeOpenButton} = "${classInHash}"]`
    )
      ? document.querySelector(
          `[${this.options.attributeOpenButton} = "${classInHash}"]`
        )
      : document.querySelector(
          `[${this.options.attributeOpenButton} = "${classInHash.replace(
            ".",
            "#"
          )}"]`
        );
    this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute)
      ? buttons.getAttribute(this.options.youtubeAttribute)
      : null;
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus();
    else focusable[0].focus();
  }
  popupLogging(message) {
    
  }
}
modules_flsModules.popup = new Popup({});
let gotoblock_gotoBlock = (
  targetBlock,
  noHeader = false,
  speed = 500,
  offsetTop = 0
) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = "";
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = "header.header";
      const headerElement = document.querySelector(headerItem);
      if (!headerElement.classList.contains("_header-scroll")) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add("_header-scroll");
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove("_header-scroll");
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else headerItemHeight = headerElement.offsetHeight;
    }
    let options = {
      speedAsDuration: true,
      speed,
      header: headerItem,
      offset: offsetTop,
      easing: "easeOutQuad",
    };
    document.documentElement.classList.contains("menu-open")
      ? menuClose()
      : null;
    if (typeof SmoothScroll !== "undefined")
      new SmoothScroll().animateScroll(targetBlockElement, "", options);
    else {
      let targetBlockElementPosition =
        targetBlockElement.getBoundingClientRect().top + scrollY;
      targetBlockElementPosition = headerItemHeight
        ? targetBlockElementPosition - headerItemHeight
        : targetBlockElementPosition;
      targetBlockElementPosition = offsetTop
        ? targetBlockElementPosition - offsetTop
        : targetBlockElementPosition;
      window.scrollTo({
        top: targetBlockElementPosition,
        behavior: "smooth",
      });
    }
    
  } else
    {}
};
// Модуль кількості товару
function formQuantity() {
  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    if (
      targetElement.closest("[data-quantity-plus]") ||
      targetElement.closest("[data-quantity-minus]")
    ) {
      const valueElement = targetElement
        .closest("[data-quantity]")
        .querySelector("[data-quantity-value]");
      let value = parseInt(valueElement.value);
      if (targetElement.hasAttribute("data-quantity-plus")) {
        value++;
        if (
          +valueElement.dataset.quantityMax &&
          +valueElement.dataset.quantityMax < value
        )
          value = valueElement.dataset.quantityMax;
      } else {
        --value;
        if (+valueElement.dataset.quantityMin) {
          if (+valueElement.dataset.quantityMin > value)
            value = valueElement.dataset.quantityMin;
        } else if (value < 1) value = 1;
      }
      targetElement
        .closest("[data-quantity]")
        .querySelector("[data-quantity-value]").value = value;
    }
  });
}
// Ініціалізація та налаштування повзунка у каталозі
function rangeInit() {
  const priceSliders = document.querySelectorAll("[data-range]");
  priceSliders.forEach((priceSlider) => {
    if (priceSlider)
      initialize(priceSlider, {
        start: [0, 2e4],
        connect: true,
        tooltips: [true, true],
        range: {
          min: [0],
          max: [2e5],
        },
        format: wNumb({
          decimals: 0,
        }),
      });
  });
  const volumeSliders = document.querySelectorAll("[data-range-volume]");
  volumeSliders.forEach((volumeSlider) => {
    if (volumeSlider)
      initialize(volumeSlider, {
        start: [0, 320],
        connect: true,
        tooltips: [true, true],
        range: {
          min: [0],
          max: [1e3],
        },
        format: wNumb({
          decimals: 0,
        }),
      });
  });
}
rangeInit();

// Ініціалізація та налаштування слайдерів
function initSliders() {
  if (document.querySelector(".promo__slider"))
    new Swiper(".promo__slider", {
      modules: [Pagination, Autoplay],
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      on: {},
    });
  if (document.querySelector(".instagram__slider"))
    new Swiper(".instagram__slider", {
      modules: [],
      observer: true,
      observeParents: true,
      slidesPerView: 5,
      spaceBetween: 24,
      centeredSlides: true,
      initialSlide: 2,
      loopAdditionalSlides: 2,
      speed: 800,
      loop: true,
      breakpoints: {
        319: {
          slidesPerView: 1.7,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
        1268: {
          slidesPerView: 5,
          spaceBetween: 24,
        },
      },
      on: {},
    });
  if (document.querySelector(true && ".about-product__slider")) {
    const pageProductThumbs = new Swiper(".about-product__thumbs-slider", {
      modules: [],
      observer: true,
      observeParents: true,
      slidesPerView: 5,
      spaceBetween: 16,
      speed: 800,
      breakpoints: {
        319.98: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        479.98: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        991.98: {
          slidesPerView: 5,
          spaceBetween: 16,
        },
      },
    });
    new Swiper(".about-product__slider", {
      modules: [Navigation, Thumb],
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 800,
      grabCursor: true,
      thumbs: {
        swiper: pageProductThumbs,
      },
      navigation: {
        prevEl: ".about-product__navigation .swiper-button-prev",
        nextEl: ".about-product__navigation .swiper-button-next",
      },
    });
  }
  if (document.querySelector(".proposals__slider"))
    new Swiper(".proposals__slider", {
      modules: [Navigation],
      observer: true,
      observeParents: true,
      slidesPerView: 4,
      spaceBetween: 16,
      speed: 800,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      breakpoints: {
        319: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        479.98: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        1268: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
      },
      on: {},
    });
  if (document.querySelector(".blog-products__slider"))
    new Swiper(".blog-products__slider", {
      modules: [Navigation],
      observer: true,
      observeParents: true,
      slidesPerView: 3,
      spaceBetween: 16,
      touchStartPreventDefault: false,
      speed: 800,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      breakpoints: {
        319: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
      on: {},
    });
}
window.addEventListener("load", function (e) {
  initSliders();
});

// pageNavigation(скрол до блоків)
let addWindowScrollEvent = false;
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-goto]")) {
        const gotoLink = targetElement.closest("[data-goto]");
        const gotoLinkSelector = gotoLink.dataset.goto
          ? gotoLink.dataset.goto
          : "";
        const noHeader = gotoLink.hasAttribute("data-goto-header")
          ? true
          : false;
        const gotoSpeed = gotoLink.dataset.gotoSpeed
          ? gotoLink.dataset.gotoSpeed
          : 500;
        const offsetTop = gotoLink.dataset.gotoTop
          ? parseInt(gotoLink.dataset.gotoTop)
          : 0;
        if (modules_flsModules.fullpage) {
          const fullpageSection = document
            .querySelector(`${gotoLinkSelector}`)
            .closest("[data-fp-section]");
          const fullpageSectionId = fullpageSection
            ? +fullpageSection.dataset.fpId
            : null;
          if (fullpageSectionId !== null) {
            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
            document.documentElement.classList.contains("menu-open")
              ? menuClose()
              : null;
          }
        } else
          gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.watch === "navigator") {
        document.querySelector(`[data-goto]._navigator-active`);
        let navigatorCurrentItem;
        if (
          targetElement.id &&
          document.querySelector(`[data-goto="#${targetElement.id}"]`)
        )
          navigatorCurrentItem = document.querySelector(
            `[data-goto="#${targetElement.id}"]`
          );
        else if (targetElement.classList.length)
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(
                `[data-goto=".${element}"]`
              );
              break;
            }
          }
        if (entry.isIntersecting)
          navigatorCurrentItem
            ? navigatorCurrentItem.classList.add("_navigator-active")
            : null;
        else
          navigatorCurrentItem
            ? navigatorCurrentItem.classList.remove("_navigator-active")
            : null;
      }
    }
  }
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`;
    else if (document.querySelector(`.${getHash()}`))
      goToHash = `.${getHash()}`;
    goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
  }
}
//додавання класів _header-scroll та _header-show до header при скролі
function headerScroll() {
  addWindowScrollEvent = true;
  const header = document.querySelector("header.header");
  const headerShow = header.hasAttribute("data-scroll-show");
  const headerShowTimer = header.dataset.scrollShow
    ? header.dataset.scrollShow
    : 500;
  const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("windowScroll", function (e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("_header-scroll")
        ? header.classList.add("_header-scroll")
        : null;
      if (headerShow) {
        if (scrollTop > scrollDirection)
          header.classList.contains("_header-show")
            ? header.classList.remove("_header-show")
            : null;
        else
          !header.classList.contains("_header-show")
            ? header.classList.add("_header-show")
            : null;
        timer = setTimeout(() => {
          !header.classList.contains("_header-show")
            ? header.classList.add("_header-show")
            : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("_header-scroll")
        ? header.classList.remove("_header-scroll")
        : null;
      if (headerShow)
        header.classList.contains("_header-show")
          ? header.classList.remove("_header-show")
          : null;
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event("windowScroll");
    window.addEventListener("scroll", function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);

// Перекидання блоків у інші блоки на адаптиві
class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }
  init() {
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    this.nodes = [...document.querySelectorAll("[data-da]")];
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });
    this.arraySort(this.оbjects);
    this.mediaQueries = this.оbjects
      .map(
        ({ breakpoint }) =>
          `(${this.type}-width: ${breakpoint}px),${breakpoint}`
      )
      .filter((item, index, self) => self.indexOf(item) === index);
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      const оbjectsFilter = this.оbjects.filter(
        ({ breakpoint }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches)
      оbjects.forEach((оbject) => {
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    else
      оbjects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname))
          this.moveBack(parent, element, index);
      });
  }
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === "last" || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === "first") {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== void 0)
      parent.children[index].before(element);
    else parent.append(element);
  }
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }
  arraySort(arr) {
    if (this.type === "min")
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if (a.place === "first" || b.place === "last") return -1;
          if (a.place === "last" || b.place === "first") return 1;
          return 0;
        }
        return a.breakpoint - b.breakpoint;
      });
    else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if (a.place === "first" || b.place === "last") return 1;
          if (a.place === "last" || b.place === "first") return -1;
          return 0;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
const da = new DynamicAdapt("max");
da.init();

// Додавання класу активності
function addActiveClass(buttonsClass, activeClass) {
  const buttons = document.querySelectorAll(buttonsClass);
  document.addEventListener("click", function (e) {
    const isClickInsideButtons = Array.from(buttons).some((button) =>
      button.contains(e.target)
    );
    const isClickInsideParent = Array.from(buttons).some((button) =>
      button.closest(buttonsClass).parentElement.contains(e.target)
    );
    if (!isClickInsideButtons && !isClickInsideParent)
      buttons.forEach((item) => {
        item.closest(buttonsClass).parentElement.classList.remove(activeClass);
      });
  });
  buttons.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      this.closest(buttonsClass).parentElement.classList.toggle(activeClass);
      buttons.forEach((otherItem) => {
        if (otherItem !== this)
          otherItem
            .closest(buttonsClass)
            .parentElement.classList.remove(activeClass);
      });
    });
  });
}
addActiveClass(".dropdown-toggle", "open-dropdown");
addActiveClass(".submenu-toggle", "open-submenu");
addActiveClass(".dropdown-menu__title", "open-category");

// Основний обробник кліку по документу
document.addEventListener("click", (e) => {
  const targetElement = e.target;
  if (targetElement.closest(".cart-header__btn"))
    targetElement.closest(".cart-header").classList.toggle("is-open");
  if (targetElement.closest(".cart-header__close"))
    targetElement.closest(".cart-header").classList.remove("is-open");
  if (!targetElement.closest(".cart-header"))
    removeClasses(document.querySelectorAll(".cart-header.is-open"), "is-open");
  if (targetElement.closest(".header__search-btn")) {
    targetElement.closest(".header__search").classList.toggle("is-open");
    if (document.querySelector(".header__contacts"))
      document.querySelector(".header__contacts").classList.toggle("hide");
  }
  if (targetElement.closest(".header__search-close")) {
    targetElement.closest(".header__search").classList.remove("is-open");
    if (document.querySelector(".header__contacts"))
      document.querySelector(".header__contacts").classList.remove("hide");
  }
  if (!targetElement.closest(".header__search")) {
    removeClasses(
      document.querySelectorAll(".header__search.is-open"),
      "is-open"
    );
    if (document.querySelector(".header__contacts"))
      document.querySelector(".header__contacts").classList.remove("hide");
  }
  if (targetElement.closest(".wish-button"))
    targetElement.closest(".wish-button").classList.toggle("active");
  if (targetElement.closest(".card-product__buy"))
    targetElement.closest(".card-product__buy").classList.add("active");
  if (targetElement.closest(".chat__btn"))
    targetElement.closest(".chat").classList.toggle("chat-open");
  if (targetElement.closest(".sort-block__btn"))
    targetElement.closest(".sort-block").classList.toggle("sort-open");
  if (!targetElement.closest(".sort-block__btn"))
    removeClasses(
      document.querySelectorAll(".sort-block.sort-open"),
      "sort-open"
    );
  if (bodyLockStatus && targetElement.closest(".catalog__filter-btn")) {
    bodyLock();
    document.documentElement.classList.add("filter-open");
  }
  if (bodyLockStatus && targetElement.closest(".aside-block__close")) {
    bodyUnlock();
    document.documentElement.classList.remove("filter-open");
  }
});

// Виклик select2
$(document).ready(function () {
  $("[data-select]").select2({
    minimumResultsForSearch: 1 / 0,
  });
  $("[data-select-search]").select2({});
});
// Будування галереї
Fancybox.bind("[data-fancybox]", {});

// Виклик функцій
menuInit();
spollers();
tabs();
showMore();
formQuantity();
pageNavigation();
headerScroll();
