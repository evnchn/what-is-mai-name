// ==UserScript==
// @name         what-is-mai-name
// @namespace    https://github.com/evnchn/what-is-mai-name
// @version      2.0
// @description  Custom names for friends on maimai DX net
// @match        https://maimaidx-eng.com/maimai-mobile/friend/*
// ==/UserScript==




(function () {
    'use strict';

    // https://poe.com/s/bdiJU29DG197XMfKf4dP
    function isJSONValid(jsonString) {
        try {
            var x = JSON.parse(jsonString);
            x["write_to_me_ok"]; // see if writing is OK
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // https://scanapp.org/html5-qrcode-docs/docs/intro
    // https://poe.com/s/jdzwPkTgimlWR799epjV
    function showModalScanner() {
        localStorage.setItem("mai-name-scanning", "yes");
        document.body.innerHTML = "";
        function onScanSuccess(decodedText, decodedResult) {
            // handle the scanned code as you like, for example:
            console.log(`Code matched = ${decodedText}`, decodedResult);


            if (isJSONValid(decodedText) && localStorage.getItem("mai-name-scanning") == "yes") {
                localStorage.setItem("mai-name-scanning", "no");
                localStorage.setItem("friend_idx_JSON", decodedText);
                //alert("Code scanned! Reloading");
                //document.body.innerHTML = "";
                location.reload();
            }
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // for example:
            console.warn(`Code scan error = ${error}`);
        }

        // Create the modal element
        var modal = document.createElement("div");
        modal.id = "modalScanner";
        modal.className = "modal-scanner";

        // Create the modal content element
        var modalContent = document.createElement("div");
        modalContent.className = "modal-content-scanner";

        // Create the reader element
        var reader = document.createElement("div");
        reader.id = "reader";

        // Append the reader element to the modal content
        modalContent.appendChild(reader);

        // Append the modal content to the modal
        modal.appendChild(modalContent);

        // Append the modal to the body
        document.body.appendChild(modal);

        // Display the modal
        modal.style.display = "block";

        // Create the HTML5 QR Code Scanner
        var html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
        );
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }

    // https://poe.com/s/LQxxiyKJePhisjYzkFqo
    function loadQRCodeScript(callback) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

        script.onload = function () {
            // Script loaded successfully
            callback();
        };

        script.onerror = function () {
            // Error loading script
            console.error('Error loading QRCode.js.');
        };

        document.head.appendChild(script);
    }

    // https://poe.com/s/LQxxiyKJePhisjYzkFqo
    function loadQRScannerCodeScript(callback) {
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode';

        script.onload = function () {
            // Script loaded successfully
            callback();
        };

        script.onerror = function () {
            // Error loading script
            console.error('Error loading QRCode.js.');
        };

        document.head.appendChild(script);
        console.log("SCANNER LOADED");

        document.head.appendChild(
            Object.assign(document.createElement('style'), {
                innerHTML:
                    `
        /* CSS for the modal */
        .modal-scanner {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
        }
    
        .modal-content-scanner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }`}));
    }

    // https://poe.com/s/nOBhAAW6GRkXLAsYh2UK
    loadQRScannerCodeScript(function () {
        loadQRCodeScript(function () {
            document.head.appendChild(
                Object.assign(document.createElement('style'), {
                    innerHTML:
                        `
        /* Styling for the modal overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: white;
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
    
        /* Styling for the modal content */
        .modal-content {
          background-color: none;
          padding:0px;
          text-align: center;
          width:80%;
          height:80%;
        }
        #qrcode {
        width:100%;
        height:100%;
        }
        #qrcode > canvas{
        width:100%;
        height:100%;
        object-fit: contain;
        }
        #qrcode > img{
        width:100%;
        height:100%;
        object-fit: contain;
        }
    `}));

            function showModal(text_in) {
                // Create the modal overlay div
                var modalOverlay = document.createElement("div");
                modalOverlay.id = "modalOverlay";
                modalOverlay.className = "modal-overlay";
                modalOverlay.onclick = hideModal;

                // Create the modal content div
                var modalContent = document.createElement("div");
                modalContent.id = "modalContent";
                modalContent.className = "modal-content";

                // Create the QR code div
                var qrCodeDiv = document.createElement("div");
                qrCodeDiv.id = "qrcode";

                // Append elements to the modal content div
                // modalContent.appendChild(document.createElement("h2")).textContent = "QR Code";
                modalContent.appendChild(qrCodeDiv);

                // Append modal content div to the modal overlay div
                modalOverlay.appendChild(modalContent);

                // Append modal overlay div to the body
                document.body.appendChild(modalOverlay);

                // Generate the QR code
                var qrCode = new QRCode(qrCodeDiv, {
                    text: text_in,  // Replace with your URL or any text you want
                    width: 2000,
                    height: 2000,
                });

                // Show the modal overlay
                modalOverlay.style.display = "flex";
            }

            function hideModal() {
                // Remove the modal overlay div
                var modalOverlay = document.getElementById("modalOverlay");
                modalOverlay.parentNode.removeChild(modalOverlay);
            }

            const titleElement = document.querySelector(".title");
            const friendIdxJSON = localStorage.getItem("friend_idx_JSON");
            titleElement.addEventListener("click", function () {



                if (window.location.href.includes('/search/')) {
                    showModalScanner();
                } else {
                    if (friendIdxJSON) {
                        showModal(friendIdxJSON);
                    }
                }
            });
        })
    });




    // https://poe.com/s/sYEZ3OkCm00PqBoV3fvt
    // https://poe.com/s/tzTuMLUbW1IVits86e7M

    document.head.appendChild(
        Object.assign(document.createElement('style'), {
            innerHTML:
                `
    span.friend_name {
        font-size: 16px;
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
      }

      .edit_button {
        display: inline-block;
      }
      .what_is_mai_name {
        display: flex;
        justify-content: space-between;
      }
`}));

    // https://poe.com/s/37w7R1x0HLIhbddDknHl
    function show_mai_name() {
        if (window.location.href.includes('/friend/')) {
            var seeThroughBlocks = document.querySelectorAll('.see_through_block');

            // https://poe.com/s/ucBfQWPp389HJLcYoYaG
            var friendDictionary;
            var friendIdxJSON = localStorage.getItem("friend_idx_JSON");

            if (friendIdxJSON) {
                friendDictionary = JSON.parse(friendIdxJSON);
            } else {
                friendDictionary = {}; // Initialize an empty object if the localStorage item is empty
            }

            seeThroughBlocks.forEach(function (block) {
                var input = block.querySelector('input[name="idx"]');
                if (input) {
                    var value = input.value;
                    var friendCommentBlock = block.querySelector('.friend_comment_block');
                    if (friendCommentBlock) {
                        // Remove existing .what_is_mai_name divs
                        var existingDivs = friendCommentBlock.querySelectorAll('.what_is_mai_name');
                        existingDivs.forEach(function (div) {
                            div.parentNode.removeChild(div);
                        });

                        var whatIsMyNameDiv = document.createElement('div');
                        whatIsMyNameDiv.className = 'what_is_mai_name';

                        var friendNameContainer = document.createElement('span');
                        friendNameContainer.className = 'friend_name';
                        var friendName = friendDictionary[value] || `ID ${value} not found`;
                        friendNameContainer.innerText = friendName;

                        var editButton = document.createElement('button');
                        editButton.className = 'edit_button';
                        editButton.innerText = 'Edit Name';
                        editButton.addEventListener('click', function () {
                            var newFriendName = prompt('Enter the new name for the friend:');
                            if (newFriendName) {
                                friendDictionary[value] = newFriendName;
                                localStorage.setItem("friend_idx_JSON", JSON.stringify(friendDictionary));
                                show_mai_name(); // Update the displayed name
                            }
                        });

                        whatIsMyNameDiv.appendChild(friendNameContainer);
                        whatIsMyNameDiv.appendChild(editButton);
                        friendCommentBlock.appendChild(whatIsMyNameDiv);
                    }
                }
            });
        }
    }

    show_mai_name(); // Run the function immediately after defining


})();