window.scrollTo(0, document.body.scrollHeight);
const roomName = "{{ room_name }}";
const userId = "{{ request.user.id }}";
const username = "{{ request.user.username }}";
const receiverId = "{{ userid }}"
const chatSocket = new WebSocket("wss://" + window.location.host + '/ws/chat/' + roomName + '/');
let reconnectInterval = 3000; // Time to wait before attempting a reconnect (3 seconds)
let maxRetries = 10; // Max number of reconnect attempts
let retries = 0;

// Function to toggle the emoji picker
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker.style.display === 'none' || emojiPicker.style.display === '') {
        emojiPicker.style.display = 'block';
    } else {
        emojiPicker.style.display = 'none';
    }
}

// Function to add emoji to the text
function addEmoji(emoji) {
    const emojiContainer = document.getElementById('id_message_send_input');
    emojiContainer.value += emoji;
}

// Close emoji picker if clicked outside
document.addEventListener('click', function (event) {
    const emojiPicker = document.getElementById('emojiPicker');
    const triggerBtn = document.querySelector('.trigger-btn');

    if (!emojiPicker.contains(event.target) && event.target !== triggerBtn) {
        emojiPicker.style.display = 'none';
    }
});




// Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        console.log(`File "${file.name}" selected!`);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result // Get base64 data
            chatSocket.send(JSON.stringify({ image_data: base64Image, file_name: file.name, sender_id: userId, receiver_id: receiverId }));
        };

        reader.readAsDataURL(file);  // Read file as Base64

        // You can upload the file via AJAX or perform other actions here
        // For demonstration, we'll simply log it to the console
        console.log(file);
        chatSocket.send(JSON.stringify({ message: messageInput, sender_id: userId, receiver_id: receiverId}));
    }
}

function connectSocket1(){
    chatSocket.onopen = function (e) {
      console.log("The connection was setup successfully !");
      var foo = document.getElementById('loader-wrapper');
        if (foo.style.display == 'block') {
                foo.style.display = 'none';
            }
    };
    chatSocket.onclose = function (e) {
      console.log(e);

        // Check if it's a normal close (code 1000), if not, attempt to reconnect
        if (event.code !== 1000 && retries < maxRetries) {
          retries++;
          console.log(`Reconnecting... Attempt ${retries}`);
          setTimeout(connectSocket1, reconnectInterval);
        } else {
          console.log("Max reconnect attempts reached or socket closed normally.");
        }
    };

    document.querySelector("#id_message_send_input").focus();
    document.querySelector("#id_message_send_input").onkeyup = function (e) {
      if (e.keyCode == 13) {
        document.querySelector("#id_message_send_button").click();
      }
    };

    document.querySelector("#id_message_send_button").onclick = function (e) {
      var messageInput = document.querySelector(
        "#id_message_send_input"
      ).value;

      if (messageInput != ""){
        chatSocket.send(JSON.stringify({ message: messageInput, sender_id: userId, receiver_id: receiverId}));
        }
      else{
        alert("Enter valid message");
      }

    };


    chatSocket.onmessage = (e) =>{

      const data = JSON.parse(e.data);
      let type = data.type;
      console.log(type)
             if(type == 'call_received') {
            window.location.href = "videocall/";
            onNewCall(response.data)
        }

      if (data.sender != username){
        if (data.media != null){
            window.location.reload()
        }
        else{
            var element = document.createElement("li");
            element.classList.add("other");
            var div = document.createElement("div");
            div.classList.add("avatar");
            let img = document.createElement("img");
            img.src = "https://i.imgur.com/DY6gND0.png";
            img.draggable = "false";
            div.append(img)
            var div2 = document.createElement("div");
            div2.classList.add("msg");
            let p = document.createElement("p");
            p.textContent = data.message;
            let p2 = document.createElement("time");
            p2.textContent = data.timestamp;
            div2.appendChild(p);
            div2.appendChild(p2);
            document.querySelector("#id_message_send_input").value = "";
            element.append(div)
            element.append(div2)
            document.querySelector("#id_chat_item_container").appendChild(element);
        }
      }
      else{
        if (data.media != null){
            window.location.reload()
        }
        else{
            var element = document.createElement("li");
            element.classList.add("self");
            var div = document.createElement("div");
            div.classList.add("avatar");
            let img = document.createElement("img");
            img.src = "https://i.imgur.com/HYcn9xO.png";
            img.draggable = "false";
            div.append(img)
            var div2 = document.createElement("div");
            div2.classList.add("msg");
            let p = document.createElement("p");
            p.textContent = data.message;
            let p2 = document.createElement("time");
            p2.textContent = data.timestamp;
            div2.appendChild(p);
            div2.appendChild(p2);
            document.querySelector("#id_message_send_input").value = "";
            element.append(div)
            element.append(div2)
            document.querySelector("#id_chat_item_container").appendChild(element);
        }
      }
    };

}


