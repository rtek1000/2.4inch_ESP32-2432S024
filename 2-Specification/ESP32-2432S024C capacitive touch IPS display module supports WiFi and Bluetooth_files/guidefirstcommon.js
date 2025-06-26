function getAllChangeArr() {
    var notClassArr = ["v-website", "evc-toolbar", "v-time"];
    var querySelectorString = "";
    var getGuideWastr = "";
    var getGuideImStr = "";
    for (let index = 0; index < notClassArr.length; index++) {
        querySelectorString =
            querySelectorString + ":not(." + notClassArr[index] + ")";
    }
    getGuideWastr = `*${querySelectorString}>[onclick^="getGuideCustomwa"],*${querySelectorString}>[onclick^=" getGuideCustomwa"]`;
    getGuideImStr = `*${querySelectorString}>[onclick^="getGuideCustomIm"],*${querySelectorString}>[onclick^=" getGuideCustomIm"]`;
    var handDialogBtn = document.querySelectorAll(
        '[onclick^="handDialog"],[onclick^="creatDialog"],[onclick^=" handDialog"],[onclick^=" creatDialog"]'
    );
    var handContactBtn = document.querySelectorAll(
        '[onclick^="f_top_product_line2_contact"],[onclick^="f_product_lin2_contact"],[onclick*="openDialog"],[onclick^="f_category_three_point_submit"]'
    );
    var kwd_pid_btn = document.querySelectorAll(
        "a[onclick^=\"document.querySelector('#kwd_pid')\"]"
    );
    var getGuideWaBtn = document.querySelectorAll(getGuideWastr);
    var getGuideImBtn = document.querySelectorAll(getGuideImStr);
    var setwebimCookieBtn = document.querySelectorAll(
        "div[onclick^=setwebimCookie],div[onclick^=' setwebimCookie']"
    );
    var aContactnow = document.querySelectorAll(
        '*:not(#floatAd):not(.vr-bottom-msg) a[href$="contactnow.html"],[onclick*="contactnow.html"]'
    );
    var quireoneBtn = document.querySelectorAll(
        '*:not(#floatAd) a[href^="javascript:quireone"] *[type="submit"][name="submit"]'
    );
    var formChangeAction = document.querySelectorAll(
        '*:not(#floatAd) form[action$="contactnow.html"][method="POST"] *[type="submit"][name="submit"],*:not(#floatAd) form[action$="contactnow.html"][method="POST"]:not([onsubmit]):not([target]) button[type="submit"]'
    );
    var formChangeAction2 = document.querySelectorAll(
        '*:not(#floatAd) form[onsubmit^="return changeAction"][method="POST"] *[type="submit"][name="submit"]'
    );
    var hu_header_click_form_btn = document.querySelectorAll(
        "a[onclick^=\"document.getElementById('hu_header_click_form'\"]"
    );
    var webimContact_btn = document.querySelectorAll(
        "[href$='webim/webim_tab_mobile.html']:not(.footer_webim_a)"
    );
    var sumChangeArr = [
        ...hu_header_click_form_btn,
        ...getGuideWaBtn,
        ...getGuideImBtn,
        ...kwd_pid_btn,
        ...setwebimCookieBtn,
        ...handDialogBtn,
        ...formChangeAction,
        ...aContactnow,
        ...formChangeAction2,
        ...quireoneBtn,
        ...webimContact_btn,
        ...handContactBtn
    ];
    return sumChangeArr;
}
var pseudoElementStyle = "";
var contentValue = "";
function hideBtnText(item) {
    if (item) {
        item.target = ''
        item.classList.add("addLoading");
        item.addEventListener(
            "click",
            function (event) {
                var shouldPreventPropagation = sessionStorage.getItem(
                    "shouldPreventPropagation"
                );
                if (shouldPreventPropagation == "true") {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            },
            true
        );
    }
}
function showBtnText(item) {
    item.classList.add("hideAddLoading");
    item.classList.remove("addLoading");
    item.target = ''
    sessionStorage.setItem("shouldPreventPropagation", false);
}

setTimeout(function () {
    sessionStorage.setItem("shouldPreventPropagation", "true");
    var hideTextArrSum = getAllChangeArr();
    for (var i = 0; i < hideTextArrSum.length; i++) {
        hideBtnText(hideTextArrSum[i]);
    }
});
function afterHideBtnText() {
    var afteContactnow = document.querySelectorAll(
        '*:not(#floatAd) a[href$="contactnow.html"]'
    );
    for (var i = 0; i < afteContactnow.length; i++) {
        afteContactnow[i].classList.add("addLoading");
    }
}
function compareTexts(text1, text2) {
    // 去除空格并转换为小写形式
    var processedText1 = text1.replace(/\s/g, "").toLowerCase();
    var processedText2 = text2.replace(/\s/g, "").toLowerCase();

    // 进行比较
    return processedText1 === processedText2;
}

function changeAllBtnText(changeTextArr) {
    var changeTextArrSum = changeTextArr ? changeTextArr : getAllChangeArr();
    if (window.isShowGuide == 0 || !window.isShowGuide) {
        for (var i = 0; i < changeTextArrSum.length; i++) {
            showBtnText(changeTextArrSum[i]);
        }
    } else {
        var str_chat_text = "Chat";
        var str_chat_now_text = "Chat Now";
        var str_contact1_text = "Get Best Price";
        var str_contact2_text = "Best Price";
        var str_contact3_text = "Get Price";
        var str_call_now_text = "Call Now";
        try {
            str_chat_text = str_chat
                ? str_chat.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Chat";
            str_chat_now_text = str_chat_now
                ? str_chat_now.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Chat Now";
            str_contact1_text = str_contact1
                ? str_contact1.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Get Best Price";
            str_contact2_text = str_contact2
                ? str_contact2.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Best Price";
            str_contact3_text = str_contact3
                ? str_contact3.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Get Price";
            str_call_now_text = str_call_now
                ? str_call_now.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
                : "Call Now";
        } catch (error) { }
        function changeBtnText(item) {
            var hideIcon = "";
            var hideTextClass = "";
            var guiicon = "cusall";
            if (window.isShowGuide == 2) {
                guiicon = "cusim";
            } else if (window.isShowGuide == 3) {
                guiicon = "cuswa";
            }
            var text = item.innerText || item.value;
            if (!text) {
                return;
            }
            text = text.trim();
            var textLength = new Array();
            textLength = text.split(" ").length;
            //判断外围标签是否含有内部class，feitian，i
            var hasIcon =
                item.innerHTML.includes("class=") ||
                item.innerHTML.includes("feitian") ||
                item.innerHTML.includes("iconfont") ||
                item.innerHTML.includes("<i") ||
                item.innerHTML.includes("<img");
            var loaction = "";
            // 循环取子元素
            var nextIcon = false;
            var prevIcon = false;
            var changeIcon = false;
            var changeLoaction = false;
            var elementTextWrap = "";
            var elementEndTextWrap = "";
            var elementWrap = "span";
            for (let index = 0; index < item.childNodes.length; index++) {
                const element = item.childNodes[index];
                if (element.children && element.children.length > 1) {
                    for (let index = 0; index < element.children.length; index++) {
                        const elementItem = element.children[index];
                        if (
                            (elementItem.nodeValue &&
                                elementItem.nodeValue.replaceAll(/\s|\n/g, "")) ||
                            (elementItem.innerText &&
                                elementItem.innerText.replaceAll(/\s|\n/g, ""))
                        ) {
                            try {
                                if (
                                    getComputedStyle(elementItem).display == "none" ||
                                    getComputedStyle(elementItem)["font-size"] == "0px"
                                ) {
                                    hideTextClass = "elementHideText";
                                }
                            } catch (error) { }
                            if (
                                elementItem.nextElementSibling &&
                                elementItem.nextElementSibling.nodeType === Node.ELEMENT_NODE
                            ) {
                                var pseudoElementStyle = window.getComputedStyle(
                                    elementItem.nextElementSibling,
                                    "::before"
                                );
                                var contentValue =
                                    pseudoElementStyle.getPropertyValue("content");
                                var pseudoElementStyle2 = window.getComputedStyle(
                                    elementItem.nextElementSibling,
                                    "::after"
                                );
                                var contentValue2 =
                                    pseudoElementStyle2.getPropertyValue("content");
                                var computedStyle = window.getComputedStyle(elementItem.nextElementSibling);
                                var hascontent1 =
                                    contentValue != "none" &&
                                    contentValue != '""' &&
                                    contentValue != "''" &&
                                    contentValue ||
                                    pseudoElementStyle.backgroundImage !== "none";
                                var hascontent2 =
                                    contentValue2 != "none" &&
                                    contentValue2 != '""' &&
                                    contentValue2 != "''" &&
                                    contentValue2 ||
                                    pseudoElementStyle2.backgroundImage !== "none";
                                if (
                                    hascontent1 ||
                                    hascontent2 ||
                                    elementItem.nextElementSibling.nodeName == "IMG" || computedStyle.backgroundImage !== "none"
                                ) {
                                    nextIcon = true;
                                }
                                if (
                                    getComputedStyle(elementItem.nextElementSibling).display ==
                                    "none" ||
                                    getComputedStyle(elementItem.nextElementSibling)[
                                    "font-size"
                                    ] == "0px"
                                ) {
                                    hideIcon = "elementHideIcon";
                                }
                            } else if (
                                elementItem.previousElementSibling &&
                                elementItem.previousElementSibling.nodeType ===
                                Node.ELEMENT_NODE
                            ) {
                                var pseudoElementStyle = window.getComputedStyle(
                                    elementItem.previousElementSibling,
                                    "::before"
                                );
                                var contentValue =
                                    pseudoElementStyle.getPropertyValue("content");
                                var pseudoElementStyle2 = window.getComputedStyle(
                                    elementItem.previousElementSibling,
                                    "::after"
                                );
                                var contentValue2 =
                                    pseudoElementStyle2.getPropertyValue("content");
                                var computedStyle = window.getComputedStyle(elementItem.previousElementSibling);

                                var hascontent1 =
                                    contentValue != "none" &&
                                    contentValue != '""' &&
                                    contentValue != "''" &&
                                    contentValue ||
                                    pseudoElementStyle.backgroundImage !== "none";
                                var hascontent2 =
                                    contentValue2 != "none" &&
                                    contentValue2 != '""' &&
                                    contentValue2 != "''" &&
                                    contentValue2 ||
                                    pseudoElementStyle2.backgroundImage !== "none";
                                if (
                                    hascontent1 ||
                                    hascontent2 ||
                                    (elementItem.previousElementSibling &&
                                        elementItem.previousElementSibling.nodeName == "IMG") ||
                                    computedStyle.backgroundImage !== "none"
                                ) {
                                    prevIcon = true;
                                }
                                if (
                                    getComputedStyle(elementItem.previousElementSibling)
                                        .display == "none" ||
                                    getComputedStyle(elementItem.previousElementSibling)[
                                    "font-size"
                                    ] == "0px"
                                ) {
                                    hideIcon = "elementHideIcon";
                                }
                            }


                            if (
                                nextIcon ||
                                prevIcon ||
                                (elementItem.previousElementSibling &&
                                    elementItem.previousElementSibling.nodeName == "IMG") ||
                                (elementItem.nextElementSibling &&
                                    elementItem.nextElementSibling.nodeName == "IMG")
                            ) {
                                changeIcon = true;
                                hasIcon = true;
                            }
                            if (!changeIcon) {
                                if (!nextIcon && !prevIcon) {
                                    hasIcon = false;
                                }
                            }
                            if (
                                elementItem.nextElementSibling &&
                                elementItem.nextElementSibling.nodeType !== Node.TEXT_NODE
                            ) {
                                if (!changeLoaction) {
                                    loaction = "";
                                }
                            }

                            if (
                                (elementItem.previousElementSibling &&
                                    elementItem.previousElementSibling.nodeType ==
                                    Node.TEXT_NODE &&
                                    !elementItem.previousElementSibling.nodeValue.includes(
                                        "\n"
                                    ) &&
                                    elementItem.nodeType != Node.TEXT_NODE) ||
                                (elementItem.previousElementSibling &&
                                    elementItem.previousElementSibling.nodeName == "IMG")
                            ) {
                                changeLoaction = true;
                                loaction = "IconShowBefore";
                                break;
                            }
                        }
                    }
                    break;
                }
                // 子元素为含有文本时，判断子标签是否前后是否含有元素并且隐藏时
                else if (
                    (element.nodeValue && element.nodeValue.replaceAll(/\s|\n/g, "")) ||
                    (element.innerText && element.innerText.replaceAll(/\s|\n/g, ""))
                ) {
                    if (element.tagName) {
                        elementTextWrap = `<${element.tagName.toLowerCase()} class="${element.className}">`;
                        elementEndTextWrap = `</${element.tagName.toLowerCase()}>`;
                    }
                    try {
                        if (
                            getComputedStyle(element).display == "none" ||
                            getComputedStyle(element)["font-size"] == "0px"
                        ) {
                            hideTextClass = "elementHideText";
                        }
                    } catch (error) { }
                    if (
                        element.nextElementSibling &&
                        element.nextElementSibling.nodeType === Node.ELEMENT_NODE
                    ) {
                        var pseudoElementStyle = window.getComputedStyle(
                            element.nextElementSibling,
                            "::before"
                        );
                        var contentValue = pseudoElementStyle.getPropertyValue("content");
                        var pseudoElementStyle2 = window.getComputedStyle(
                            element.nextElementSibling,
                            "::after"
                        );
                        var contentValue2 = pseudoElementStyle2.getPropertyValue("content");
                        var computedStyle = window.getComputedStyle(element.nextElementSibling);

                        var hascontent1 =
                            contentValue != "none" &&
                            contentValue != '""' &&
                            contentValue != "''" &&
                            contentValue ||
                            pseudoElementStyle.backgroundImage !== "none";
                        var hascontent2 =
                            contentValue2 != "none" &&
                            contentValue2 != '""' &&
                            contentValue2 != "''" &&
                            contentValue2 ||
                            pseudoElementStyle2.backgroundImage !== "none";
                        if (
                            hascontent1 ||
                            hascontent2 ||
                            element.nextElementSibling.nodeName == "IMG" ||
                            computedStyle.backgroundImage !== "none"
                        ) {
                            nextIcon = true;
                        }
                        if (
                            getComputedStyle(element.nextElementSibling).display == "none" ||
                            getComputedStyle(element.nextElementSibling)["font-size"] == "0px"
                        ) {
                            hideIcon = "elementHideIcon";
                        }
                    } else if (
                        element.previousElementSibling &&
                        element.previousElementSibling.nodeType === Node.ELEMENT_NODE
                    ) {
                        var pseudoElementStyle = window.getComputedStyle(
                            element.previousElementSibling,
                            "::before"
                        );
                        var contentValue = pseudoElementStyle.getPropertyValue("content");
                        var pseudoElementStyle2 = window.getComputedStyle(
                            element.previousElementSibling,
                            "::after"
                        );
                        var contentValue2 = pseudoElementStyle2.getPropertyValue("content");
                        var computedStyle = window.getComputedStyle(element.previousElementSibling);

                        var hascontent1 =
                            contentValue != "none" &&
                            contentValue != '""' &&
                            contentValue != "''" &&
                            contentValue ||
                            pseudoElementStyle.backgroundImage !== "none";
                        var hascontent2 =
                            contentValue2 != "none" &&
                            contentValue2 != '""' &&
                            contentValue2 != "''" &&
                            contentValue2 ||
                            pseudoElementStyle2.backgroundImage !== "none";
                        if (hascontent1 || hascontent2 || computedStyle.backgroundImage !== "none") {
                            prevIcon = true;
                            changeLoaction = true;
                            loaction = "IconShowBefore";
                        }
                        if (
                            getComputedStyle(element.previousElementSibling).display ==
                            "none" ||
                            getComputedStyle(element.previousElementSibling)["font-size"] ==
                            "0px"
                        ) {
                            hideIcon = "elementHideIcon";
                        }
                    }

                    if (
                        nextIcon ||
                        prevIcon ||
                        (element.previousElementSibling &&
                            element.previousElementSibling.nodeName == "IMG") ||
                        (element.nextElementSibling &&
                            element.nextElementSibling.nodeName == "IMG")
                    ) {
                        changeIcon = true;
                        hasIcon = true;
                    }
                    if (!changeIcon) {
                        if (!nextIcon && !prevIcon) {
                            hasIcon = false;
                        }
                    }
                    if (
                        element.nextSibling &&
                        element.nextSibling.nodeType !== Node.TEXT_NODE &&
                        element.nodeType == Node.TEXT_NODE
                    ) {
                        if (!changeLoaction) {
                            loaction = "";
                        }
                    }

                    if (
                        (element.previousElementSibling &&
                            element.previousElementSibling.nodeType == Node.TEXT_NODE &&
                            !element.previousElementSibling.nodeValue.includes("\n") &&
                            element.nodeType != Node.TEXT_NODE) ||
                        (element.previousElementSibling &&
                            element.previousElementSibling.nodeName == "IMG")
                    ) {
                        changeLoaction = true;
                        loaction = "IconShowBefore";
                        break;
                    }
                }
            }
            if (item.nodeType === Node.ELEMENT_NODE) {
                var pseudoElementStyle = window.getComputedStyle(item, "::before");
                var contentValue = pseudoElementStyle.getPropertyValue("content");
                var pseudoElementStyle2 = window.getComputedStyle(item, "::after");
                var contentValue2 = pseudoElementStyle2.getPropertyValue("content");
                var computedStyle = window.getComputedStyle(item);

                var hascontent1 =
                    contentValue != "none" &&
                    contentValue != '""' &&
                    contentValue != "''" &&
                    contentValue ||
                    pseudoElementStyle.backgroundImage !== "none";
                var hascontent2 =
                    contentValue2 != "none" &&
                    contentValue2 != '""' &&
                    contentValue2 != "''" &&
                    contentValue2 ||
                    pseudoElementStyle2.backgroundImage !== "none";
                if (hascontent1 || hascontent2 ||
                    computedStyle.backgroundImage !== "none") {
                    hasIcon = true;
                }
                if (hasIcon) {
                    item.classList.add("removeIconContent");
                }
                if (hascontent1) {
                    loaction = "IconShowBefore";
                }
            }
            if (item.innerHTML.includes("icon13next")) {
                guiicon = "iconfont icon13next";
            }
            if (item.innerHTML.includes("iconNext_")) {
                guiicon = "iconfont iconNext_";
            }
            if (item.innerHTML.includes("iconfont iconmail_ r_msg intercept")) {
                guiicon = "iconfont iconmail_ r_msg intercept";
            }
            if (
                item.innerHTML.includes("icon13next") ||
                item.innerHTML.includes("iconNext_") ||
                item.innerHTML.includes("iconfont iconmail_ r_msg intercept")
            ) {
                item.classList.remove("removeIconContent");
            }
            if (hideTextClass == "elementHideText") {
                item.classList.add("elementHideText");
            }
            //进行文本替换

            if (
                !compareTexts(str_contact1_text, text) &&
                !compareTexts(str_contact2_text, text) &&
                !compareTexts(str_contact3_text, text) &&
                !compareTexts(str_call_now_text, text)
            ) {
                var changeText = "";
                if (item.innerHTML.includes("<i")) {
                    elementWrap = "i";
                }
                if (hasIcon && item.nodeName != 'INPUT') {
                    if (hideTextClass == "elementHideText") {
                        changeText =
                            `<${elementWrap} class="${hideIcon}  ${guiicon}"></${elementWrap}>`;
                    } else {
                        if (textLength >= 2) {
                            changeText =
                                loaction == "IconShowBefore"
                                    ? `<${elementWrap} class="${hideIcon}  ${guiicon}  ${loaction} "></${elementWrap}> ${elementTextWrap ? elementTextWrap : ""
                                    }${str_chat_now_text}${elementEndTextWrap ? elementEndTextWrap : ""
                                    }`
                                    : `${elementTextWrap ? elementTextWrap : ""
                                    }${str_chat_now_text}${elementEndTextWrap ? elementEndTextWrap : ""
                                    } <${elementWrap} class="${hideIcon}  ${guiicon}"></${elementWrap}>`;
                        } else {
                            changeText =
                                loaction == "IconShowBefore"
                                    ? `<${elementWrap} class="${hideIcon}  ${guiicon}  ${loaction} "></${elementWrap}> ${elementTextWrap ? elementTextWrap : ""
                                    }${str_chat_text}${elementEndTextWrap ? elementEndTextWrap : ""
                                    }`
                                    : `${elementTextWrap ? elementTextWrap : ""
                                    }${str_chat_text} ${elementEndTextWrap ? elementEndTextWrap : ""
                                    }<${elementWrap} class="${hideIcon}  ${guiicon}"></${elementWrap}>`;
                        }
                    }
                } else {
                    if (textLength >= 2) {
                        changeText = str_chat_now_text;
                    } else {
                        changeText = str_chat_text;
                    }
                }
                if (item.nodeName == 'INPUT') {
                    item.value = changeText;
                    if (hasIcon) {
                        item.classList.add(guiicon);
                    }
                } else {
                    if (hasIcon) {
                        item.innerHTML = changeText;
                    } else {
                        replaceTextInElement(item, changeText)
                    }
                }
            } else {
                item.classList.remove("removeIconContent");
            }
        }
        for (var i = 0; i < changeTextArrSum.length; i++) {
            // 文本替换
            if (
                !changeTextArrSum[i].innerHTML.includes("icon13contacts") &&
                !changeTextArrSum[i].innerHTML.includes("iconfont iconmail_ r_msg intercept") &&
                !changeTextArrSum[i].innerHTML.includes("icon-contact")
            ) {
                if (changeTextArrSum[i].innerHTML.includes('<span class="glyphicon glyphicon-user">')) {
                    if (changeTextArrSum[i] && changeTextArrSum[i].childNodes[1]) {
                        changeTextArrSum[i].childNodes[1].textContent = str_chat_now_text
                    }
                } else {
                    changeBtnText(changeTextArrSum[i]);
                }
            }
        }
    }
}
function replaceTextInElement(element, newText) {
    for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
            if ((child.nodeValue && child.nodeValue.replaceAll(/\s|\n/g, "")) ||
                (child.innerText && child.innerText.replaceAll(/\s|\n/g, ""))) {
                child.textContent = newText;
                break
            }

        } else if (child.nodeType === Node.ELEMENT_NODE) {
            // 递归处理元素节点
            replaceTextInElement(child, newText);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        changeAllBtnText();
    });
});
