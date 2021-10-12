const boom_sound = "./sounds/boom.wav";
const clap_sound = "./sounds/clap.wav";
const hi_hat_sound = "./sounds/hi_hat.wav";
const kick_sound = "./sounds/kick.wav";
const open_hat_sound = "./sounds/open_hat.wav";
const ride_sound = "./sounds/ride.wav";
const snare_sound = "./sounds/snare.wav";
const tink_sound = "./sounds/tink.wav";
const tom_sound = "./sounds/tom.wav";
const target_board_size = 7;
const middle_point = 4;
const history_slot = 3;
let game_score = 0;
let game_start_status = false;
//let start_button = document.getElementById("start_button_id");

// let game_note = ["G", "S", "A", "A", "S", "S"];
let game_note_data = [
  "D",
  "S",
  "D",
  "A",
  "D",
  "S",
  "D",
  "A",
  "F",
  "D",
  "S",
  "D",
  "A",
];

//const target_card_data = [{ key: "A", status: "" }];
let target_card_data = [];
let target_buffer_data = [];
let target_result_data = [];

let upcoming_note = {
  arr: [],
  arr_size: 4,
};

let history_note = {
  arr: [],
  arr_size: 3,
};

function prepare_game() {
  reset_data();
  generate_note_pair();
  initialize_target_board();
  start_timer(10);
  //start_button.innerText = "End Game";
  game_start_status = true;
  //clearTarget();
  //   initialize_upcoming_arr(game_note);
  //   initialize_target_board();
}

function generate_note_pair() {
  let note_num = game_note_data.length;
  let game_note = game_note_data.slice();

  while (note_num > 0) {
    target_card_data.push({ key: game_note.shift(), status: "" });
    note_num--;
  }
}

function reset_data() {
  game_score = 0;
  target_card_data = [];
  target_buffer_data = [];
  target_result_data = [];
}

function initialize_target_board() {
  clearTarget();
  let count = middle_point;

  //const target_box = document.querySelector(".target-box");

  for (let i = 1; i <= history_slot; i++) {
    const target_card = document.createElement("div");
    target_card.classList.add("target-card");

    const target_box = document.querySelector(".target-box");
    target_box.prepend(target_card);
  }

  while (count > 0) {
    const target_card = document.createElement("div");
    target_card.classList.add("target-card");

    let card_data = target_card_data.shift();
    target_buffer_data.push(card_data);

    target_card.textContent = card_data.key;

    if (count == middle_point) {
      target_card.classList.add("active");
    }

    const target_box = document.querySelector(".target-box");
    target_box.prepend(target_card);
    count--;
  }
}

function game_start(keypressed) {
  note_hit_checker(keypressed.toUpperCase());
  // this.addEventListener("keypress", (event) => {
  //   let keypressed = event.key;
  //   note_hit_checker(keypressed.toUpperCase());
  // });
}

function note_hit_checker(key) {
  if (target_buffer_data.length > 0) {
    let current_target = target_buffer_data.shift();
    if (key === current_target.key) {
      current_target.status = "correct";
      update_game_score();
    } else {
      current_target.status = "wrong";
    }

    if (target_card_data.length > 0) {
      target_buffer_data.push(target_card_data.shift());
    }

    if (target_buffer_data.length > 0) {
      target_buffer_data[0].status = "active";
    }

    current_target.key = key;
    target_result_data.unshift(current_target);
  }

  clearTarget();
  update_target_box();
}

function update_game_score() {
  game_score++;
  let score_id = document.getElementById("score");
  score_id.textContent = game_score;
}

function update_target_box() {
  history_update_process();
  current_update_process();
}

function current_update_process() {
  let buffer_count = 0;
  let buffer_clear = false;
  while (buffer_count < middle_point) {
    buffer_size = target_buffer_data.length;
    if (buffer_clear != true && buffer_size > 0) {
      let filled = false;
      while (filled === false) {
        if (buffer_count < buffer_size && buffer_count < middle_point) {
          if (buffer_count > 0) {
            create_target_element(
              target_buffer_data[buffer_count],
              false,
              false
            );
          } else {
            create_target_element(
              target_buffer_data[buffer_count],
              true,
              false
            );
          }
          buffer_count++;
        } else {
          buffer_clear = true;
          filled = true;
        }
      }
    } else {
      create_target_element("", false, true);
      buffer_count++;
    }
  }
}

function history_update_process() {
  let history_size = target_result_data.length;
  let history_count = 0;
  if (history_size < history_slot) {
    let filler_count = history_slot - history_size;

    while (filler_count > 0) {
      create_target_element("", false, true);
      history_count++;
      filler_count--;
    }
    let index = history_size - 1;
    while (index >= 0) {
      create_target_element(target_result_data[index], true, false);
      index--;
    }
  } else {
    for (let i = 2; i >= 0; i--) {
      create_target_element(target_result_data[i], true, false);
    }
  }
}
// function broken_history_update_process() {
//   let history_count = 0;
//   let result_clear = false;
//   while (history_count < history_slot) {
//     result_size = target_result_data.length;
//     if (result_clear != true && result_size > 0) {
//       let filled = false;
//       while (filled === false) {
//         if (history_count < result_size && history_count < history_slot) {
//           create_target_element(target_result_data[history_count], true);
//           history_count++;
//         } else {
//           result_clear = true;
//           filled = true;
//         }
//       }
//     } else {
//       create_target_element("", false);
//       history_count++;
//     }
//   }
// }

function create_target_element(target_data, not_empty_status, filler) {
  const target_card = document.createElement("div");
  target_card.classList.add("target-card");

  if (not_empty_status === true) {
    target_card.classList.add(target_data.status);
  }

  if (filler === false) {
    target_card.textContent = target_data.key;
  }

  const target_box = document.querySelector(".target-box");
  target_box.prepend(target_card);
}

// function initialize_target_board() {
//   let upcoming_size = upcoming_note.arr.length;
//   let box_id = "key-upcoming-";
//   let box_id_count = upcoming_size;
//   let current_index = 0;

//   while (box_id_count > 0) {
//     let current_box_id = box_id + box_id_count;
//     document.getElementById(current_box_id).textContent =
//       upcoming_note.arr[current_index];
//     current_index++;
//     box_id_count--;
//   }
// }

// function initialize_upcoming_arr(note_arr) {
//   let count = upcoming_note.arr_size;
//   while (count > 0) {
//     upcoming_note.arr.push(game_note.shift());
//     count--;
//   }
// }

function trigger_sound(url) {
  new Audio(url).play();
}

this.addEventListener("keypress", (event) => {
  if (game_start_status === true) {
    let keypressed = event.key;
    game_start(keypressed);
  }

  switch (event.key) {
    case "a":
      trigger_sound(clap_sound);
      break;

    case "s":
      trigger_sound(hi_hat_sound);
      break;

    case "d":
      trigger_sound(kick_sound);
      break;

    case "f":
      trigger_sound(open_hat_sound);
      break;

    case "g":
      trigger_sound(boom_sound);
      break;

    case "h":
      trigger_sound(ride_sound);
      break;

    case "j":
      trigger_sound(snare_sound);
      break;

    case "k":
      trigger_sound(tom_sound);
      break;

    case "l":
      trigger_sound(tink_sound);
      break;
  }
});

//let start_button = document.getElementById("start_button_id");

let reset_timer = false;
function start_timer(duration) {
  let current_time = duration;
  const interval_id = setInterval(() => {
    const timer_id = document.getElementById("timer");
    timer_id.textContent = formatTime(current_time);
    current_time--;
    if (current_time < 0) {
      clearInterval(interval_id);
    }
  }, 1000);
}

function formatTime(time) {
  minutes = ("0" + Math.floor(time / 60)).substr(-2);
  seconds = ("0" + Math.floor(time % 60)).substr(-2);
  return `${minutes}:${seconds}`;
}

function clearTarget() {
  const target_box = document.querySelector(".target-box");
  target_box.querySelectorAll("*").forEach((e) => e.remove());
}

function updateTarget() {
  target_card_data.forEach((t) => {
    const target_card = document.createElement("div");

    target_card.classList.add("target-card");
    if (t.status !== "") {
      target_card.classList.add(t.status);
    }

    target_card.textContent = t.key;
    const target_box = document.querySelector(".target-container");
    target_box.appendChild(target_card);
  });
}
