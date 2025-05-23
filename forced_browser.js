/**
* Made with love by KLCiS Voucher System
* https://klinternetservices.com
* https://facebook.com/mr.partingtime

- v2 changelog
 * Enhanced Browser Detection Script
 * Features:
 * - Comprehensive mini-browser detection
 * - Graceful error handling
 * - Responsive design for all devices
 * - Accessibility improvements
 * - Fallback mechanisms
 **/

document.addEventListener("DOMContentLoaded", function() {
    const config = {
        popupDelay: 500, 
        browserTimeouts: { 
            primary: 500,
            secondary: 1000,
            fallback: 1500
        },
        debug: false 
    };

    function isInMiniBrowser() {
        try {
            const ua = navigator.userAgent.toLowerCase();
            const webviewPatterns = [
                "wv",               // Android webview
                "fb",               // Facebook
                "instagram",        // Instagram
                "twitter",          // Twitter
                "snapchat",         // Snapchat
                "line",             // Line
                "wechat",           // WeChat
                "tiktok",           // TikTok
                "fbav",             // Facebook app
                "fban",             // Facebook app
                "linkedin",         // LinkedIn
                "pinterest",        // Pinterest
                "whatsapp",         // WhatsApp
                "telegram",         // Telegram
                "discord",          // Discord
                "viber"             // Viber
            ];
            

            return webviewPatterns.some(pattern => ua.includes(pattern));
        } catch (error) {
            logError("Error detecting browser type", error);
            return false;
        }
    }

    function getDeviceType() {
        try {
            const ua = navigator.userAgent.toLowerCase();
            
            if (/iphone|ipad|ipod/i.test(ua)) return "ios";
            if (/android/i.test(ua)) return "android";
            if (/windows phone/i.test(ua)) return "windowsphone";
            if (/mac/i.test(ua)) return "mac";
            if (/windows/i.test(ua)) return "windows";
            if (/linux/i.test(ua)) return "linux";
            
            return "unknown";
        } catch (error) {
            logError("Error detecting device type", error);
            return "unknown";
        }
    }


    function openInBrowser() {
        try {
            const url = window.location.href;
            const deviceType = getDeviceType();
            const urlWithoutProtocol = url.replace(/^https?:\/\//, "");
            let opened = false;
            
            if (deviceType === "ios") {

                showCopyMessage();
            } else if (deviceType === "android") {
  
                try {
                    window.location = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end;`;
                    
                    setTimeout(() => {
                        if (!opened) {
                            window.location = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=org.mozilla.firefox;end;`;
                        }
                    }, config.browserTimeouts.primary);
                    
                    setTimeout(() => {
                        if (!opened) {
                            window.location = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.microsoft.emmx;end;`;
                        }
                    }, config.browserTimeouts.secondary);
                    setTimeout(() => {
                        if (!opened) {
                            window.location = url;
                        }
                    }, config.browserTimeouts.fallback);
                } catch (err) {
                    logError("Error redirecting on Android", err);
                    window.location = url;
                }
            } else {
                try {
                    const newTab = window.open(url, '_blank');
                    
                    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                        window.location.href = url;
                    } else {
                        opened = true;
                    }
                } catch (err) {
                    logError("Error opening new window", err);
                    window.location.href = url;
                }
            }
        } catch (error) {
            logError("Error in openInBrowser", error);
            showErrorMessage("Unable to open in browser. Please copy and paste the URL manually.");
        }
    }

    function createPopup() {
        try {
            const deviceType = getDeviceType();
            
            let popup = document.createElement("div");
            popup.id = "browserPopup";
            popup.setAttribute("role", "dialog");
            popup.setAttribute("aria-labelledby", "popupTitle");
            popup.setAttribute("aria-describedby", "popupDescription");
            
            let baseStyles = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: white;
                text-align: center;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            `;
            
            let contentWrapper = document.createElement("div");
            contentWrapper.style = `
                width: 90%;
                max-width: 500px;
                background: #222;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                max-height: 90vh;
                overflow-y: auto;
            `;
            
            let title = document.createElement("h2");
            title.id = "popupTitle";
            title.style = `
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 1.4rem;
                color: #fff;
            `;
            title.innerText = "For the Best Experience";
            
            let description = document.createElement("p");
            description.id = "popupDescription";
            description.style = `
                margin-bottom: 20px;
                line-height: 1.5;
                font-size: 1rem;
            `;
            
            if (deviceType === "ios") {
                description.innerHTML = `
                    This page may not work correctly in your current browser. For the best experience, please:
                    <ol style="text-align: left; margin: 15px 0; padding-left: 20px;">
                        <li>Copy the link below</li>
                        <li>Open Safari</li>
                        <li>Paste and go to the link</li>
                    </ol>
                `;
            } else if (deviceType === "android") {
                description.innerHTML = `
                    This page may not work correctly in your current browser. For the best experience, please tap the button below to open in Chrome, Firefox, or another browser.
                `;
            } else {
                description.innerHTML = `
                    This page may not work correctly in your current browser. For the best experience, please tap the button below to open in your default browser.
                `;
            }
            
            let button = document.createElement("button");
            button.innerText = "Open in Browser";
            button.setAttribute("aria-label", "Open in full browser");
            button.style = `
                padding: 12px 24px;
                background: #2563eb;
                color: white;
                font-size: 16px;
                font-weight: 600;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                margin-bottom: 15px;
                width: 100%;
            `;
            button.onmouseover = function() { this.style.background = "#1d4ed8"; };
            button.onmouseout = function() { this.style.background = "#2563eb"; };
            button.onclick = function() {
                try {
                    openInBrowser();
                } catch (error) {
                    logError("Error handling button click", error);
                    showErrorMessage("Unable to open in browser. Please try copying the link manually.");
                }
            };
            
            let copyLink = document.createElement("div");
            copyLink.style = `
                margin: 15px 0;
                padding: 10px;
                background: #333;
                color: #fff;
                border-radius: 8px;
                word-break: break-all;
                font-size: 14px;
                cursor: pointer;
                border: 1px solid #555;
            `;
            copyLink.innerHTML = `<span style="display: block; margin-bottom: 5px; font-size: 12px; color: #aaa;">Tap to copy:</span>${window.location.href}`;
            copyLink.setAttribute("aria-label", "Copy link to clipboard");
            copyLink.setAttribute("role", "button");
            copyLink.setAttribute("tabindex", "0");
            
            copyLink.onclick = function() {
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(window.location.href)
                            .then(() => {
                                showCopySuccess();
                            })
                            .catch(error => {
                                logError("Clipboard API error", error);
                                fallbackCopy();
                            });
                    } else {
                        fallbackCopy();
                    }
                } catch (error) {
                    logError("Error copying to clipboard", error);
                    fallbackCopy();
                }
            };
            
            copyLink.onkeydown = function(e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.click();
                }
            };
            
            let closeButton = document.createElement("button");
            closeButton.innerText = "Continue Anyway";
            closeButton.setAttribute("aria-label", "Dismiss notification and continue");
            closeButton.style = `
                margin-top: 15px;
                padding: 10px 20px;
                background: transparent;
                color: #aaa;
                font-size: 14px;
                border: 1px solid #555;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
            `;
            closeButton.onmouseover = function() { 
                this.style.background = "#333";
                this.style.color = "#fff";
            };
            closeButton.onmouseout = function() { 
                this.style.background = "transparent";
                this.style.color = "#aaa";
            };
            closeButton.onclick = function() {
                try {
                    if (popup.parentNode) {
                        document.body.removeChild(popup);
                    }
                } catch (error) {
                    logError("Error closing popup", error);
                    // Force remove if error
                    if (document.getElementById("browserPopup")) {
                        document.getElementById("browserPopup").remove();
                    }
                }
            };
            
            let statusMessage = document.createElement("div");
            statusMessage.id = "statusMessage";
            statusMessage.style = `
                margin-top: 15px;
                padding: 0;
                height: 24px;
                font-size: 14px;
                color: #4ade80;
                transition: all 0.3s;
                visibility: hidden;
            `;
            
            let legalText = document.createElement("p");
            legalText.style = `
                margin-top: 20px;
                font-size: 12px;
                color: #888;
                line-height: 1.4;
            `;
            legalText.innerHTML = "We recommend using a standard browser for full functionality and security features.";

            contentWrapper.appendChild(title);
            contentWrapper.appendChild(description);
            contentWrapper.appendChild(button);
            contentWrapper.appendChild(copyLink);
            contentWrapper.appendChild(statusMessage);
            contentWrapper.appendChild(closeButton);
            contentWrapper.appendChild(legalText);
            popup.appendChild(contentWrapper);
            
            document.addEventListener("keydown", function(e) {
                if (e.key === "Escape" && document.body.contains(popup)) {
                    try {
                        document.body.removeChild(popup);
                    } catch (error) {
                        logError("Error closing popup with ESC key", error);
                    }
                }
            });
            
            document.body.appendChild(popup);
            button.focus();
            
        } catch (error) {
            logError("Error creating popup", error);
        }
    }
    

    function showCopySuccess() {
        try {
            const statusMessage = document.getElementById("statusMessage");
            if (statusMessage) {
                statusMessage.innerText = "✓ Link copied successfully";
                statusMessage.style.color = "#4ade80"; // Success green
                statusMessage.style.visibility = "visible";
                
                setTimeout(() => {
                    statusMessage.style.visibility = "hidden";
                }, 3000);
            }
        } catch (error) {
            logError("Error showing copy success", error);
        }
    }
    
    function showCopyMessage() {
        try {
            const statusMessage = document.getElementById("statusMessage");
            if (statusMessage) {
                statusMessage.innerHTML = "Please copy the link above and open it in Safari";
                statusMessage.style.color = "#3b82f6";
                statusMessage.style.visibility = "visible";
                
                setTimeout(() => {
                    statusMessage.style.visibility = "hidden";
                }, 5000);
            }
        } catch (error) {
            logError("Error showing copy message", error);
        }
    }
    

    function showErrorMessage(message) {
        try {
            const statusMessage = document.getElementById("statusMessage");
            if (statusMessage) {
                statusMessage.innerText = message || "An error occurred";
                statusMessage.style.color = "#ef4444"; // Error red
                statusMessage.style.visibility = "visible";
                
                setTimeout(() => {
                    statusMessage.style.visibility = "hidden";
                }, 5000);
            }
        } catch (error) {
            logError("Error showing error message", error);
         
            try {
                alert(message || "An error occurred. Please try copying the URL manually.");
            } catch (e) {
    
            }
        }
    }
    

    function fallbackCopy() {
        try {

            const textArea = document.createElement("textarea");
            textArea.value = window.location.href;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            // Try to copy
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showCopySuccess();
            } else {
                showErrorMessage("Please manually select and copy the link");
            }
        } catch (error) {
            logError("Error in fallback copy", error);
            showErrorMessage("Please manually select and copy the link");
        }
    }
    
    function logError(message, error) {
        if (config.debug) {
            console.error(`[Browser Detection]: ${message}`, error);
        }
    }
    
    try {
        if (isInMiniBrowser()) {
            setTimeout(() => {
                createPopup();
            }, config.popupDelay);
        }
    } catch (error) {
        logError("Fatal error in browser detection", error);
    }
});
