// ==UserScript==
// @name         Watch and Append DOM Changes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Watches for text changes in a specific DOM node and appends replaced text to a new node.
// @author       YourName
// @match        https://blazer.instacart.tools/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Target the node which you want to monitor
    const resultNode = document.querySelector('#results'); // Change #targetNode to your desired node's selector
    
    if (!resultNode) {
        console.warn('Results node not found.');
        return;
    }

    // Create a new node to store the replaced text
    const logNode = document.createElement('div');
    logNode.style.position = 'fixed';
    logNode.style.bottom = '0';
    logNode.style.left = '0';
    logNode.style.right = '0';
    logNode.style.width = '100%';
    logNode.style.height = '40vh';
    logNode.style.border = '2px solid #e2e8f0';
    logNode.style.borderRadius = '12px 12px 0 0';
    logNode.style.padding = '20px';
    logNode.style.backgroundColor = '#f8fafc';
    logNode.style.boxShadow = '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)';
    logNode.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    logNode.style.overflowY = 'auto';
    logNode.style.zIndex = '1000';
    logNode.innerHTML = '<h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">📊 Old Results</h2>';
    document.body.appendChild(logNode);

    let previousHtml = resultNode.innerHTML;

    // Create a MutationObserver to listen for changes
    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const currentHtml = resultNode.innerHTML;
                
                if (currentHtml !== previousHtml) {
                    // Append the replaced text to the log node
                    const replacedHtml = previousHtml;
                    
                    // Skip saving if the replacedHtml contains a div with class "text-muted"
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = replacedHtml;
                    const loadingParagraph = tempDiv.querySelector('p.text-muted');
                    
                    if (!loadingParagraph || loadingParagraph.textContent.trim() !== 'Loading...') {
                        const newResultDiv = '<div style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; padding: 16px; background-color: #ffffff; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">' + replacedHtml + '</div>';
                        // Insert after the header (first child is the h2)
                        logNode.firstElementChild.insertAdjacentHTML('afterend', newResultDiv);
                    }

                    // Update the previousHtml to the new text
                    previousHtml = currentHtml;
                }
            }
        }
    });

    // Configuration for the observer
    const config = { characterData: true, childList: true, subtree: true };

    // Start observing the target node
    observer.observe(resultNode, config);

    console.log('MutationObserver is now watching:', resultNode);
})();