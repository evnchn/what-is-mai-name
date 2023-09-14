// ==UserScript==
// @name         what-is-mai-name
// @namespace    https://github.com/evnchn/what-is-mai-name
// @version      1.2
// @description  Custom names for friends on maimai DX net
// @match        https://maimaidx-eng.com/*
// @match        http://maimaidx-eng.com/*
// ==/UserScript==




(function () {
    'use strict';

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
`})
    );

    // https://poe.com/s/37w7R1x0HLIhbddDknHl
    function show_mai_name() {
        if (window.location.href.includes('/friend/')) {
            var seeThroughBlocks = document.querySelectorAll('.see_through_block');
            var friendDictionary = JSON.parse(localStorage.getItem("friend_idx_JSON"));

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