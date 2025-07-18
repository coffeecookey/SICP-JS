// Portal Game - Physics-based Portal System with Multi-Level Support
import {
    init_unity_academy_2d, set_start, set_update, instantiate_sprite, 
    set_position, get_position, get_key_down, get_key, translate_world,
    apply_rigidbody, add_impulse_force, get_velocity, set_velocity,remove_collider_components,
    on_collision_enter, same_gameobject, get_main_camera_following_target,
    copy_position, destroy, vector3, get_x, get_y, get_z,set_custom_prop, gui_button,
    get_custom_prop,set_scale, get_scale, set_rotation_euler, delta_time, gui_label
} from "unity_academy";

import { create_rectangle, create_sprite, create_text, query_position, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio } from "arcade_2d";
// const bg_audio = play_audio(loop_audio(create_audio("https://raw.githubusercontent.com/Dualupa/sounds/main/peaceNeko.mp3", 2.06)));
const bg_audio = play_audio(loop_audio(create_audio("https://raw.githubusercontent.com/Dualupa/sounds/main/bossencounter.m4a", 3.10)));

init_unity_academy_2d();

// Helper function for array checking
function is_array(x) {
    return x !== undefined && get_array_length(x) !== undefined;
}


// Source language compatibility functions
const Math_floor = x => x - x % 1;
const math_abs = x => x < 0 ? -x : x;
const math_sin = x => {
    // Simple sine approximation for Source language
    const pi = 3.14159265359;
    x = x % (2 * pi);
    if (x < 0) {
        x = x + 2 * pi;
    }
    // Taylor series approximation
    return x - (x * x * x) / 6 + (x * x * x * x * x) / 120;
};
const math_sqrt = x => {
    if (x <= 0) {
        return 0;
    }
    let guess = x;
    let i = 0;
    while (i < 10) {
        guess = (guess + x / guess) / 2;
        i = i + 1;
    }
    return guess;
};

const bg_lab = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/bg-lab4.png');

const bg_lab_start = (self) => {
    set_scale(self,vector3(2.5,1.5,0));
    set_position(self,vector3(-2,1,100));
    remove_collider_components(self);
};

// Create a hidden timer object
const timer_object = instantiate_sprite('https://unity-academy.s3.ap-southeast-1.amazonaws.com/external_assets/mystery_box.png');
set_custom_prop(timer_object, "timer", 0);

const timer_start = (self) => {
    set_scale(self,vector3(0,0,0));
};

// Update the timer each frame
const timer_update = (self) => {
    const t = get_custom_prop(self, "timer");
    set_custom_prop(self, "timer", t + delta_time());
};

// Define get_time() to return the object's timer value
const get_time = () => get_custom_prop(timer_object, "timer");

function repeat_string(str, times) {
    let result = "";
    let i = 0;
    while (i < times) {
        result = result + str;
        i = i + 1;
    }
    return result;
}

function get_canvas_width(){
    return 800;
}

function get_canvas_height(){
    return 600;
}


// Map definition - Multiple levels with new elements
// Legend: 0=empty, 1=wall, 2=exit, 3=entrance, button/door(4/5, 14/15, 24,25), 6=ticket spawn, 7=mystery box spawn

// Level 1 - Basic Portal Introduction (Gap crossing)
const map1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Level 2 - Height Challenge (Multi-floor)
const map2 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,6,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Level 3 - Button and Door Puzzle
const map3 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Level 4 - Advanced Puzzle
const map4  = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,6,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,24,0,0,0,0,1,0,0,0,14,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,7,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,6,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,25,25,25,25,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,1,1,15,15,15,15,15,15,15,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,5,5,5,5,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,4,0,1,0,0,7,0,0,0,24,0,1,0,0,2,0,14,0,0,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]
];


const map5 =  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,1,0,0,1,0,0,0,0],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,7,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,5,5,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,25,25,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,25,25,25,25,25,25,25,1,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,5,5,5,5,5,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,15,15,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [3,0,0,4,0,0,1,0,24,0,0,0,0,0,1,0,0,2,0,0,0,0,1,0,24,1,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]
  ];
  
const map6 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,7,0,0,15,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,7,0,0,15,0,24,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,25,25,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,2,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,15,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,15,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,15,15,1,0,0,1],
    [1,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,5,0,0,0,0,25,0,0,0,25,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,14,0,0,0,5,0,24,0,0,25,0,4,0,25,0,0,24,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,5,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [3,0,0,4,0,0,5,0,0,1,0,6,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];
  
const map7 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,14,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,6,1],
  [1,0,0,0,0,25,0,0,0,0,0,1,0,0,0,4,0,0,0,0,0,0,0,0,0,1,25,25,25,1],
  [1,24,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,2,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,4,0,1,1,5,5,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,1,1,5,1,1,1,0,0,0,0,0,0,0,0,0,15,0,0,0,1],
  [1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,24,25,25,25,15,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,5,5,5,1],
  [1,4,0,7,0,4,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
  [1,1,5,5,5,1,1,25,25,25,25,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,15,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,5,0,0,0,1],
  [3,0,14,0,0,15,0,0,24,0,1,0,0,1,0,0,1,0,0,4,0,0,0,0,0,5,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
  

// Map array for easy level management
const maps = [map1, map2, map3, map4, map5, map6, map7];

// Size settings
const tileSize = 0.4;
const platformScale = 0.008; 
const playerScale = 0.18;
const cubeScale = 0.2;
const goalScale = 0.1;
const portalScale = 0.1;

// === 버튼/도어 타입별 개별 크기 상수 ===
// 버튼: [파랑, 초록, 빨강]
const BUTTON_SCALES = [
    [0.25, 0.25], // 파랑 버튼 (wall tile의 1/4)
    [0.05, 0.05], // 초록 버튼
    [0.05, 0.05]  // 빨강 버튼
];
// 도어: [파랑, 초록, 빨강]
const DOOR_SCALES = [
    [0.115, 0.25], // 파랑 도어 (wall tile과 동일, 높이 3/4)
    [0.11, 0.25], // 초록 도어
    [0.10, 0.25]  // 빨강 도어
];

const portal_placeable_tiles = [1, 8, 9, 10];

// Game variables
let platforms = [];
let platform_positions = [];
let platform_count = 0;
let aiming_indicator = null;
let show_tutorial = false;
let show_help = false;
let tutorial_step = 0;
let tutorial_timer = 0;
let weight_objects = [];

// Portal system with direction tracking
let blue_portal = null;
let orange_portal = null;
let blue_portal_direction = [0, 0];
let orange_portal_direction = [0, 0];
let carrying_object = null;
let next_portal_is_blue = true;
let player_facing_direction = 1;
let portal_creation_mode = false;
let teleport_cooldown = 0;
let game_started = false;

// Portal teleportation status tracking
let player_in_blue_portal = false;
let player_in_orange_portal = false;
let cube_in_blue_portal = false;
let cube_in_orange_portal = false;

// Game state
let current_level = 0;
let current_map = maps[current_level];
let level_complete_timer = 0;
let level_completed = false;

// Button/Door pair management - 3-pair system
let buttons = [[], [], []]; // 3 pairs: buttons[0], buttons[1], buttons[2]
let doors = [[], [], []];   // 3 pairs: doors[0], doors[1], doors[2]
let button_states = [false, false, false]; // Button press state for each pair
let door_is_open = [false, false, false];  // Door open state for each pair

// Button/Door pair color images
const button_images = [
    "https://raw.githubusercontent.com/Dualupa/button-door/main/button_blue.png", // Pair 0 (blue)
    "https://raw.githubusercontent.com/Dualupa/button-door/main/button_green2.png", // Pair 1 (green)
    "https://raw.githubusercontent.com/Dualupa/button-door/main/button_red2.png"    // Pair 2 (red)
];
const door_images = [
    "https://raw.githubusercontent.com/Dualupa/button-door/main/door_blue.png", // Pair 0 (blue)
    "https://raw.githubusercontent.com/Dualupa/button-door/main/door_green.png", // Pair 1 (green)
    "https://raw.githubusercontent.com/Dualupa/button-door/main/door_red.png"    // Pair 2 (red)
];

// Calculate array length
const get_array_length = (arr) => {
    let count = 0;
    let i = 0;
    while (arr[i] !== undefined) {
        count = count + 1;
        i = i + 1;
    }
    return count;
};

let transition_state = "playing"; 
let transition_timer = 0;
let transition_duration = 2.0;
let loading_dots = 0;
let loading_dot_timer = 0;
let transition_temp_platform = null;

// Game objects
const player = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/s1.png");
const cube = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/card.png");
let inlet = null;
let outlet = null;

// Camera
const camera_target = get_main_camera_following_target();

const show_start_screen = () => {
    const start_bg = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/EXIT%20PROTOCOL%20(1).png");

    const start_start = (self) => {
        remove_collider_components(self);
        set_scale(self, vector3(1.7, 1.5, 0));
        set_position(self, vector3(0.3, 0, -100));
        
    };

    const start_update = (self) => {
        if (get_key("x")) {
            destroy(self); // remove background
            game_started = true;
        }
    };

    set_start(start_bg, start_start);
    set_update(start_bg, start_update);

    const center_x = get_canvas_width() / 2;
    const center_y = get_canvas_height() / 2;

    gui_label("<size=70><color=white><b>EXIT PROTOCOL</b></color></size>", center_x - 250, center_y - 100);
    gui_label("<size=36><color=orange><b>Press X to Start</b></color></size>", center_x - 180, center_y);
};

show_start_screen();

const update_tutorial_system = () => {
    if (current_level === 0) { // Only show tutorial on map 1
        show_tutorial = true;
        
        // Tutorial step progression based on game state
        const player_pos = get_position(player);
        const player_x = get_x(player_pos);
        
        if (tutorial_step === 0 && player_x > -5.0) {
            tutorial_step = 1;
            tutorial_timer = 0;
        } else if (tutorial_step === 1 && (blue_portal !== null || orange_portal !== null)) {
            tutorial_step = 2;
            tutorial_timer = 0;
        } else if (tutorial_step === 2 && blue_portal !== null && orange_portal !== null) {
            tutorial_step = 3;
            tutorial_timer = 0;
        } else if (tutorial_step === 3 && player_x > -1.0) {
            tutorial_step = 4;
            tutorial_timer = 0;
        }
        
        tutorial_timer = tutorial_timer + delta_time();
    } else {
        show_tutorial = false;
        tutorial_step = 0;
        tutorial_timer = 0;
    }
};


const display_loading_screen = () => {
        if (transition_state === "loading" || transition_state === "transitioning") {
            
            const loading_bg = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/black.jpg');
            
            const loading_start = (self) =>{
                remove_collider_components(self);
                set_scale(self, vector3(5,5,0));
                set_position(self,vector3(0,0,-100));
            };
            
            const loading_update = (self) =>{
                destroy(self);
            };
            
            set_start(loading_bg,loading_start);
            
            // Loading text
            const center_x = get_canvas_width() / 2;
            const center_y = get_canvas_height() / 2;
            
            gui_label("<size=36><color=white>TRANSITIONING TO LEVEL " + (current_level + 1) + "</color></size>", 650, center_y - 50);
            
            // Animated loading dots
            let dots = "";
            let i = 0;
            while (i < loading_dots) {
                dots = dots + "•";
                i = i + 1;
            }
            gui_label("<size=70><color=orange><b>LOADING " + dots + "</b></color></size>", 650, center_y);
            
            // Progress bar
            const progress = transition_timer / transition_duration;
            const bar_width = 300;
            const bar_height = 20;
            const filled_width = bar_width * progress;
            
            // Progress bar background
            // gui_label(repeat_string("", Math_floor(bar_width / 8)), center_x - bar_width / 2, center_y + 40, "rgba(100,100,100,0.5)", "8px monospace");
            
            // Progress bar fill
            if (filled_width > 0) {
                gui_label("<color=white><size=50><b>" + repeat_string(".", Math_floor(filled_width / 8))+"</b></size></color>", 650, center_y + 60);
            }
            
            // Percentage
            const percentage = Math_floor(progress * 100);
            gui_label("<size=80><color=white>" + percentage + "%</color></size>", 1050, center_y-10);
            gui_label("<size=36><color=orange><b>EXIT REBOOTING...</b></color></size>", 650, center_y + 120);
            
            set_update(loading_bg, loading_update);
        }
    };

const update_transition_system = () => {
    if (transition_state === "loading" || transition_state === "transitioning") {
        transition_timer = transition_timer + delta_time();
        
        // Update loading dots animation
        loading_dot_timer = loading_dot_timer + delta_time();
        if (loading_dot_timer > 0.5) {
            loading_dots = (loading_dots + 1) % 4;
            loading_dot_timer = 0;
        }
        
        // Freeze player and cube during transition
        set_velocity(player, vector3(0, 0, 0));
        set_velocity(cube, vector3(0, 0, 0));
        
        if (transition_timer >= transition_duration) {
            transition_state = "playing";
            transition_timer = 0;
            loading_dots = 0;
            loading_dot_timer = 0;
        
            current_level = (current_level + 1) % get_array_length(maps);
            current_map = maps[current_level];
            load_level(current_map);
            
        
            // Keep player on temp platform — do NOT call reset_to_entrance yet
            // Wait a short delay before teleporting to entrance
        
            let entrance_delay = 0;
            const teleport_delay_obj = instantiate_sprite("https://via.placeholder.com/1x1");
            set_update(teleport_delay_obj, (self) => {
                entrance_delay = entrance_delay + delta_time();
            if (entrance_delay >= 0.2) {
                reset_to_entrance();
                
                // Keep transition freeze active longer
                let extended_freeze = 0;
                const extended_freeze_obj = instantiate_sprite("https://via.placeholder.com/1x1");
                set_update(extended_freeze_obj, (freeze_self) => {
                    extended_freeze = extended_freeze + delta_time();
                    set_velocity(player, vector3(0, 0, 0));
                    set_velocity(cube, vector3(0, 0, 0));
                    
                    if (extended_freeze >= 0.15) {
                        set_custom_prop(player, "transition_freeze", false);
                        set_custom_prop(cube, "transition_freeze", false);
                        destroy(freeze_self);
                    }
                });
                    if (transition_temp_platform !== null) {
                        destroy(transition_temp_platform);
                        transition_temp_platform = null;
                        
                    }
                destroy(self);
                
            }
            });
            }
        }

    };

const start_level_transition = () => {
    set_custom_prop(player, "transition_freeze", true);
    set_custom_prop(cube, "transition_freeze", true);

    transition_state = "loading";
    transition_timer = 0;
    loading_dots = 0;
    loading_dot_timer = 0;

    set_velocity(player, vector3(0, 0, 0));
    set_velocity(cube, vector3(0, 0, 0));

    const player_pos = get_position(player);
    transition_temp_platform = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/factory.png');

    set_start(transition_temp_platform, (self) => {
        set_position(self, vector3(get_x(player_pos), get_y(player_pos) - 0.5, 0));
        set_scale(self, vector3(0.5, 0.1, 0));
        
    });
};



// Add this function to display tutorial messages
const display_tutorial_gui = () => {
    if (show_tutorial) {
        // Tutorial title
        gui_label("<size=30><color=white><b>PORTAL TUTORIAL</b></color></size>", 1400, 20);
        
        // Step-by-step instructions
        if (tutorial_step === 0) {
            gui_label("<size=26><color=orange>Initiating...<b>Exit Protocol</b></color></size>", 800, 700);
            gui_label("<color=orange>Reach the exit to leave the facility.</color>", 800, 730);
            gui_label("<color=white>Use WASD to move.</color>", 800, 760);
            gui_label("<color=white><b>Move right to continue</b></color>",800, 790);
            
        } else if (tutorial_step === 1) {
            gui_label("<color=orange>You must pass through the portals...to find what you are looking for.</color>", 800, 700);
            gui_label("<color=white>Portal Creation: </color>", 800, 730);
            gui_label("<color=white> - Press 'E' to enter portal mode</color>", 800, 760);
            gui_label("<color=white> - Hold WASD to aim. Hold 2 keys to aim better. </color>", 800, 790);
            gui_label("<color=white> - The red crosshair marks the portal's placement</color>", 800, 820);
            gui_label("<color=white><b> - Click the Left Mouse button to rreate a portal and continue</b></color>", 800, 850);
            
            
        } else if (tutorial_step === 2) {
            gui_label("<color=white>Great! Now create a second portal</color>", 800, 700);
            gui_label("<color=white> - Blue and Orange portals connect</color>", 800,730);
            gui_label("<color=white> - Walk into one, exit the other</color>", 800, 760);
            gui_label("<color=white><b>Create another portal to continue</b></color>", 800,820);
            
        } else if (tutorial_step === 3) {
            gui_label("<color=white>Perfect! Portal pair created</color>", 800,700);
            gui_label("<color=white> - Walk into any portal to teleport</color>", 800,730);
            gui_label("<color=white> - Use portals to cross the gap</color>",800,760);
            gui_label("<color=white><b>Cross the gap to continue</b></color>", 1800,790);
            
        } else if (tutorial_step >= 4) {
            gui_label("<color=orange>Excellent! You've mastered portals</color>", 800,700);
            gui_label("<color=white> - Press R to reset the portals</color>", 800,730);
            gui_label("<color=white> - Find the key card and pick it up using 'F'.</color>", 800,760);
            gui_label("<color=white> - Bring the key card to the exit door to escape.</color>", 800,790);
            gui_label("<color=orange>   You are ready to travel through worlds. Good luck!</color>", 800,820);
        }
        
        // Progress indicator
        const progress_text = "<color=white>Tutorial Progress: </color>" + (tutorial_step + 1) + "/5";
        gui_label(progress_text, 800,640);
    }
};

// Add this function to display help information
const display_help_gui = () => {
    if (show_help) {
        // Semi-transparent background effect using overlapping rectangles
        const bg_width = 400;
        const bg_height = 300;
        const bg_x = (get_canvas_width() - bg_width) / 2;
        const bg_y = (get_canvas_height() - bg_height) / 2;
        
        // Create background effect with multiple dark rectangles
        // let i = 0;
        // while (i < 5) {
        //     gui_label(repeat_string("",50), bg_x - i, bg_y - i, "rgba(0,0,0,0.8)", "12px monospace");
        //     i = i + 1;
        // }
        
        // Help content
        gui_label("<color=orange><b>GAME CONTROLS & HELP</b></color>", 1500, bg_y-60);
        gui_label("<color=white> - Use WASD to move</color>", 1500, bg_y-30);
        gui_label("<color=white> - Use 'E' to enter portal mode</color>", 1500, bg_y);
        gui_label("<color=white> - Hold WASD to aim when in</color>", 1500, bg_y+30);
        gui_label("<color=white>   portal mode</color>", 1500, bg_y+60);
        gui_label("<color=white> - Use 'left mouse button' to</color>", 1500, bg_y+90);
        gui_label("<color=white>   shoot portals</color>", 1500, bg_y+120);
        gui_label("<color=white> - Use 'R' to remove both portals</color>", 1500, bg_y+150);
        gui_label("<color=white> - Use 'H' to toggle the help button</color>", 1500, bg_y+180);
        gui_label("<color=white> - Use 'Q' to reset the level </color>", 1500, bg_y + 210);
        gui_label("<color=white> - Use 'F' to pick up objects </color>", 1500, bg_y+240);

        
        // if (gui_button("Close Help", bg_x + bg_width - 100, bg_y + 10, 80, 30)) {
        //     show_help = false;
        // }
    }
};

const display_help_button = () => {
    // Help button in top-right corner
    const button_x = get_canvas_width() + 900;
    const button_y = 10;
    
    gui_button("Help", button_x, button_y, 150, 50, () => {
        
        show_help = !show_help; // Toggle help display
        
    });
};

const handle_help_input = () => {
    if (get_key_down("RightShift")) {
        show_help = false;
    }
    if (get_key_down("h") || get_key_down("H")) {
        show_help = !show_help;
    }
};

// Find entrance position - Player spawns on floor surface next to entrance block
const find_entrance_position = (level_map) => {
    for (let row = 0; row < get_array_length(level_map); row = row + 1) {
        for (let col = 0; col < get_array_length(level_map[0]); col = col + 1) {
            if (level_map[row][col] === 3) {
                const entrance_x = -5.8 + col * tileSize;
                const entrance_y = 3.2 - row * tileSize;
                
                // Find the closest walkable floor surface next to entrance
                // Check right side first (most common case)
                if (col + 1 < get_array_length(level_map[0]) && level_map[row][col + 1] === 0) {
                    return [entrance_x + tileSize, entrance_y];
                }
                // Check left side
                if (col - 1 >= 0 && level_map[row][col - 1] === 0) {
                    return [entrance_x - tileSize, entrance_y];
                }
                // Check above
                if (row - 1 >= 0 && level_map[row - 1][col] === 0) {
                    return [entrance_x, entrance_y + tileSize];
                }
                // Check below
                if (row + 1 < get_array_length(level_map) && level_map[row + 1][col] === 0) {
                    return [entrance_x, entrance_y - tileSize];
                }
                
                // Fallback to entrance block position
                return [entrance_x, entrance_y];
            }
        }
    }
    return [-5.4, -2.5]; // Default fallback
};

// Find mystery box position from map (6 = mystery box spawn)
const find_cube_position = (level_map) => {
    for (let row = 0; row < get_array_length(level_map); row = row + 1) {
        for (let col = 0; col < get_array_length(level_map[0]); col = col + 1) {
            if (level_map[row][col] === 6) {
                const x = -5.8 + col * tileSize;
                const y = 3.2 - row * tileSize;
                return [x, y];
            }
        }
    }
    
    // Fallback if no 6 found in map
    const entrance_pos = find_entrance_position(level_map);
    return [entrance_pos[0] + 1, entrance_pos[1] - 1];
};

// Generate map with new elements
const load_level = (level_map) => {
    // Clear existing elements
    for (let i = 0; i < platform_count; i = i + 1) {
        if (platforms[i] !== undefined) {
            destroy(platforms[i]);
        }
    }
    if (inlet !== null) {
        destroy(inlet);
        inlet = null;
    }
    if (outlet !== null) {
        destroy(outlet);
        outlet = null;
    }
    
    // Clear buttons and doors (3쌍 시스템)
    for (let pair = 0; pair < get_array_length(buttons); pair = pair + 1) {
        if (!is_array(buttons[pair])) {
            buttons[pair] = [];
        }
        for (let j = 0; j < get_array_length(buttons[pair]); j = j + 1) {
            if (buttons[pair][j] !== undefined) {
                destroy(buttons[pair][j]);
            }
        }
    }
    for (let pair = 0; pair < get_array_length(doors); pair = pair + 1) {
        if (!is_array(doors[pair])) {
            doors[pair] = [];
        }
        for (let j = 0; j < get_array_length(doors[pair]); j = j + 1) {
            if (doors[pair][j] !== undefined) {
                destroy(doors[pair][j]);
            }
        }
    }
    
    // Reset arrays
    platforms = [];
    platform_positions = [];
    platform_count = 0;
    buttons = [[], [], []];
    doors = [[], [], []];
    button_states = [false, false, false];
    door_is_open = [false, false, false];
    weight_objects = [];
    
    let button_count = 0;
    let door_count = 0;
    
    // Generate new level
    for (let row = 0; row < get_array_length(level_map); row = row + 1) {
        for (let col = 0; col < get_array_length(level_map[0]); col = col + 1) {
            const x = -5.8 + col * tileSize;
            const y = 3.2 - row * tileSize;
            
            if (level_map[row][col] === 1) {
                // Regular wall
                const platform = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/factory.png');
                platforms[platform_count] = platform;
                platform_positions[platform_count] = [x, y];
                
                set_start(platform, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(platformScale, platformScale, 0));
                });
                
                platform_count = platform_count + 1;
                
            } else if (level_map[row][col] === 2) {
                // Exit
                outlet = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/exit.png");
                set_start(outlet, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(0.5, 0.5, 0));
                });
                
            } else if (level_map[row][col] === 3) {
                // Entrance
                inlet = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/startblock.png");
                set_start(inlet, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(0.4, 0.5, 0));
                });
                
            } else if (level_map[row][col] === 4 || level_map[row][col] === 14 || level_map[row][col] === 24) {
                // Button (파랑/초록/빨강)
                let pair_idx = -1;
                if (level_map[row][col] === 4) { pair_idx = 0; }  // 파랑
                if (level_map[row][col] === 14) { pair_idx = 1; } // 초록
                if (level_map[row][col] === 24) { pair_idx = 2; } // 빨강
                
                const button = instantiate_sprite(button_images[pair_idx]);
                if (!is_array(buttons[pair_idx])) {
                    buttons[pair_idx] = [];
                }
                const btn_len = get_array_length(buttons[pair_idx]);
                buttons[pair_idx][btn_len] = button;
                
                set_start(button, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(BUTTON_SCALES[pair_idx][0], BUTTON_SCALES[pair_idx][1], 0));
                });
                
                button_count = button_count + 1;
                
            } else if (level_map[row][col] === 5 || level_map[row][col] === 15 || level_map[row][col] === 25) {
                // Door (파랑/초록/빨강)
                let pair_idx = -1;
                if (level_map[row][col] === 5) { pair_idx = 0; }   // 파랑
                if (level_map[row][col] === 15) { pair_idx = 1; }  // 초록
                if (level_map[row][col] === 25) { pair_idx = 2; }  // 빨강
                
                const door = instantiate_sprite(door_images[pair_idx]);
                if (!is_array(doors[pair_idx])) {
                    doors[pair_idx] = [];
                }
                const door_len = get_array_length(doors[pair_idx]);
                doors[pair_idx][door_len] = door;
                platform_positions[platform_count] = [x, y];
                
                set_start(door, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(DOOR_SCALES[pair_idx][0], DOOR_SCALES[pair_idx][1], 0));
                });
                
                platform_count = platform_count + 1;
                door_count = door_count + 1;
                
            } else if (level_map[row][col] === 7) {
                const obj = instantiate_sprite("https://unity-academy.s3.ap-southeast-1.amazonaws.com/external_assets/mystery_box.png");
                set_start(obj, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(cubeScale, cubeScale, 1));
                    apply_rigidbody(self);
                });
                let len = 0;
                while (weight_objects[len] !== undefined) {
                    len = len + 1;
                }
                weight_objects[len] = obj;
            } // Note: 6 (mystery box spawn) is handled by repositioning in reset_to_entrance
        }
    }
    // 미스터리박스(6) 위치에 생성
    const cube_pos = find_cube_position(level_map);
    set_position(cube, vector3(cube_pos[0], cube_pos[1], 0));
};

// Load initial level
load_level(current_map);

// Player setup - Initial setup, will be repositioned by load_level
const player_start = (self) => {
    // Initial position will be overridden by load_level
    set_position(self, vector3(-5.4, -2.5, 0));
    set_scale(self, vector3(playerScale, playerScale, 1));
    apply_rigidbody(self);
};

// Cube setup - Initial setup, will be repositioned by load_level  
const cube_start = (self) => {
    // set_position(self, vector3(-4, 1.5, 0)); // 위치 지정 제거
    set_scale(self, vector3(cubeScale, cubeScale, 1));
    apply_rigidbody(self);
};

// Reset to entrance
const reset_to_entrance = () => {
    set_velocity(player, vector3(0, 0, 0));
    set_velocity(cube, vector3(0, 0, 0));
    const entrance_pos = find_entrance_position(maps[current_level]);
    const cube_pos = find_cube_position(maps[current_level]);
    set_position(player, vector3(entrance_pos[0], entrance_pos[1] + 0.2, 0));  // Small height boost
    set_position(cube, vector3(cube_pos[0], cube_pos[1], 0));
    carrying_object = null;
    
    if (aiming_indicator !== null) {
        destroy(aiming_indicator);
        aiming_indicator = null;
    }
    // Clear portals
    if (blue_portal !== null) {
        destroy(blue_portal);
        blue_portal = null;
    }
    if (orange_portal !== null) {
        destroy(orange_portal);
        orange_portal = null;
    }
    next_portal_is_blue = true;
    portal_creation_mode = false;
    
    // Reset portal status
    player_in_blue_portal = false;
    player_in_orange_portal = false;
    cube_in_blue_portal = false;
    cube_in_orange_portal = false;
    blue_portal_direction = [0, 0];
    orange_portal_direction = [0, 0];
    teleport_cooldown = 0;
    
    // Reset level completion
    level_completed = false;
    level_complete_timer = 0;
    
    // Reset button and door states (3 pairs system)
    for (let i = 0; i < get_array_length(button_states); i = i + 1) {
        button_states[i] = false;
    }
    for (let i = 0; i < get_array_length(door_is_open); i = i + 1) {
        door_is_open[i] = false;
    }

};

// Next level
const next_level = () => {
    // Don't allow level change during transition
    if (transition_state !== "playing") {
        return false;
    }
    
    // Start transition
    start_level_transition();
    
    // After a short delay, actually change the level
    let destroy_timer = 0;
    let destroy_delay = 0.1; // 0.1 seconds
    const temp_platform = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/factory.png');
    set_update(temp_platform, (self) => {
        destroy_timer = destroy_timer + delta_time();
        if (destroy_timer >= destroy_delay) {
            destroy(self);
        }
    });
};
    

// Button and door system (쌍별로 동작) - 3 pairs system
const update_button_door_system = () => {
    for (let pair = 0; pair < 3; pair = pair + 1) {
        if (!is_array(buttons[pair])) {
            buttons[pair] = [];
        }
        if (!is_array(doors[pair])) {
            doors[pair] = [];
        }
        
        let any_button_pressed = false;
        
        // 해당 pair의 모든 버튼 확인
        for (let i = 0; i < get_array_length(buttons[pair]); i = i + 1) {
            if (buttons[pair][i] !== undefined) {
                const button_pos = get_position(buttons[pair][i]);
                const button_x = get_x(button_pos);
                const button_y = get_y(button_pos);
                
                const player_pos = get_position(player);
                const player_x = get_x(player_pos);
                const player_y = get_y(player_pos);
                
                const cube_pos = get_position(cube);
                const cube_x = get_x(cube_pos);
                const cube_y = get_y(cube_pos);
                
                const player_on_button = (player_x - button_x) * (player_x - button_x) + (player_y - button_y) * (player_y - button_y) < 0.15;
                const cube_on_button = (cube_x - button_x) * (cube_x - button_x) + (cube_y - button_y) * (cube_y - button_y) < 0.15;
                
                // weight_objects 판정 추가
                let weight_on_button = false;
                let k = 0;
                while (weight_objects[k] !== undefined) {
                    let obj_pos = get_position(weight_objects[k]);
                    let obj_x = get_x(obj_pos);
                    let obj_y = get_y(obj_pos);
                    if ((obj_x - button_x) * (obj_x - button_x) + (obj_y - button_y) * (obj_y - button_y) < 0.3) {
                        weight_on_button = true;
                    }
                    k = k + 1;
                }
                if (player_on_button || cube_on_button || weight_on_button) {
                    set_scale(buttons[pair][i], vector3(0.05, 0.03, 0)); // Pressed effect
                    any_button_pressed = true;
                } else {
                    set_scale(buttons[pair][i], vector3(0.05, 0.05, 0)); // Original size
                }
            }
        }
        
        // pair별 상태 업데이트
        const was_open = door_is_open[pair];
        button_states[pair] = any_button_pressed;
        door_is_open[pair] = any_button_pressed;
        
        // 도어 상태 변경이 있을 때만 업데이트
        if (was_open !== door_is_open[pair]) {
            for (let i = 0; i < get_array_length(doors[pair]); i = i + 1) {
                if (doors[pair][i] !== undefined) {
                    if (door_is_open[pair]) {
                        set_scale(doors[pair][i], vector3(0, 0, 0)); // 문 열림(숨김)
                    } else {
                        set_scale(doors[pair][i], vector3(DOOR_SCALES[pair][0], DOOR_SCALES[pair][1], 0)); // 문 닫힘(원래 크기)
                    }
                }
            }
        }
    }
};

// Portal direction calculation - 오리지널 개선된 버전
const find_first_block_in_direction = (start_x, start_y, aim_x, aim_y) => {
    const max_distance = 20;
    const step = 0.05;
    let current_distance = 0;
    let prev_tile = 0;
    while (current_distance < max_distance) {
        const test_x = start_x + (aim_x * current_distance);
        const test_y = start_y + (aim_y * current_distance);
        const col = Math_floor((test_x + 5.8) / tileSize);
        const row = Math_floor((3.2 - test_y) / tileSize);
        if (
            row >= 0 && row < get_array_length(current_map) &&
            col >= 0 && col < get_array_length(current_map[0])
        ) {
            const tile = current_map[row][col];

            // 문 타일 체크 및 도어 상태 확인
            let door_pair = -1;
            if (tile === 5) { door_pair = 0; }
            if (tile === 15) { door_pair = 1; }
            if (tile === 25) { door_pair = 2; }

            if (door_pair !== -1) {
                // 문이 열려있지 않으면 포털 생성 불가
                if (!door_is_open[door_pair]) {
                    return [0, 0, 0, 0, 0];
                }
                // 문이 열려있으면 아래 portal_placeable_tiles 체크로 진행
            }
            const array_includes = (arr, value) => {
                let i = 0;
                while (i < get_array_length(arr)) {
                    if (arr[i] === value) {
                        return true;
                    }
                    i = i + 1;
                }
                return false;
            };
            if (!array_includes(portal_placeable_tiles, prev_tile) && array_includes(portal_placeable_tiles, tile)) {
                let portal_x = test_x;
                let portal_y = test_y;
                let normal_x = 0;
                let normal_y = 0;

                // 충돌 타일의 중심 좌표 계산
                const tile_center_x = -5.8 + col * tileSize + tileSize / 2;
                const tile_center_y = 3.2 - row * tileSize - tileSize / 2;
                const dx = test_x - tile_center_x;
                const dy = test_y - tile_center_y;
                if (math_abs(dx) > math_abs(dy)) {
                    // 좌/우 벽
                    normal_x = dx > 0 ? 1 : -1;
                    normal_y = 0;
                } else {
                    // 위/아래 벽
                    normal_x = 0;
                    normal_y = dy > 0 ? 1 : -1;
                }

                // 방향별 보정
                let offset = tileSize * 0.35;
                if (normal_x === -1) {
                    // 오른쪽 벽
                    portal_x = portal_x - tileSize * 0.65;
                } else if (normal_x === 1) {
                    // 왼쪽 벽
                    portal_x = portal_x - offset;
                } else if (normal_y === -1) {
                    // 천장
                    portal_y = portal_y + offset;
                } else if (normal_y === 1) {
                    // 바닥
                    portal_y = portal_y + tileSize * 0.65;
                }
                return [portal_x, portal_y, 1, normal_x, normal_y];
            }
            prev_tile = tile;
        }
        current_distance = current_distance + step;
    }
    return [0, 0, 0, 0, 0];
};



// Create portal
const create_portal = (is_blue, world_pos, normal_x, normal_y) => {
    const portal_url = is_blue ? 
        "https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/portal1.png" : 
        "https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/portal2.png";
    
    if (is_blue) {
        if (blue_portal !== null) {
            destroy(blue_portal);
        }
        blue_portal = instantiate_sprite(portal_url);
        set_position(blue_portal, world_pos);
        set_scale(blue_portal, vector3(portalScale, portalScale, 1));
        blue_portal_direction = [normal_x, normal_y];
        
    } else {
        if (orange_portal !== null) {
            destroy(orange_portal);
        }
        orange_portal = instantiate_sprite(portal_url);
        set_position(orange_portal, world_pos);
        set_scale(orange_portal, vector3(portalScale, portalScale, 1));
        orange_portal_direction = [normal_x, normal_y];
    }
};


const update_aiming_indicator = (player_pos, aim_x, aim_y) => {
    if (aim_x === 0 && aim_y === 0) {
        if (aiming_indicator !== null) {
            destroy(aiming_indicator);
            aiming_indicator = null;
        }
        return undefined;
    }
    
    const base_x = get_x(player_pos);
    const base_y = get_y(player_pos);
    
    const result = find_first_block_in_direction(base_x, base_y, aim_x, aim_y);
    const found = result[2] === 1;
    
    if (found) {
        const portal_x = result[0];
        const portal_y = result[1];
        
        if (aiming_indicator === null) {
            aiming_indicator = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/aimer4.png");
            set_scale(aiming_indicator, vector3(0.2, 0.2, 1));
        }
        
        set_position(aiming_indicator, vector3(portal_x, portal_y, 0));
        
        const blink_speed = 3.0;
        const alpha = (math_sin(get_time() * blink_speed) + 1) / 2;
        const final_alpha = 0.3 + (alpha * 0.7);
        
        return true;
    } else {
        if (aiming_indicator !== null) {
            destroy(aiming_indicator);
            aiming_indicator = null;
        }
        return false;
    }
};


// Portal teleport function
const teleport_through_portal = (object, from_portal, to_portal, from_direction, to_direction) => {
    if (from_portal !== null && to_portal !== null && teleport_cooldown <= 0) {
        const to_pos = get_position(to_portal);
        const current_vel = get_velocity(object);
        const vel_x = get_x(current_vel);
        const vel_y = get_y(current_vel);

        let new_vel_x = vel_x;
        let new_vel_y = vel_y;

        // 방향에 따라 속도 변환
        if (from_direction[0] !== 0 && to_direction[1] !== 0) {
            new_vel_x = 0;
            new_vel_y = (-1)*from_direction[0] * vel_x * to_direction[1];
        } else if (from_direction[1] !== 0 && to_direction[0] !== 0) {
            new_vel_x = from_direction[1] * vel_y * to_direction[0];
            new_vel_y = 0;
        } else if (from_direction[0] !== 0 && to_direction[0] !== 0) {
            new_vel_x = -vel_x;
            new_vel_y = vel_y;
        } else if (from_direction[1] !== 0 && to_direction[1] !== 0) {
            new_vel_x = vel_x;
            new_vel_y = vel_y;
        }

        // 출구 위치 계산
        const safe_distance = 0.5;
        const exit_x = get_x(to_pos) + (to_direction[0] * safe_distance);
        const exit_y = get_y(to_pos) + (to_direction[1] * safe_distance);

        set_position(object, vector3(exit_x, exit_y, get_z(to_pos)));
        set_velocity(object, vector3(new_vel_x, new_vel_y, 0));
        teleport_cooldown = 0;
        return true;
    }
    return false;
};

// Check portal teleportation
const check_portal_teleportation = () => {
    if (teleport_cooldown > 0) {
        return false;
    }
    
    if (blue_portal !== null && orange_portal !== null) {
        const player_pos = get_position(player);
        const player_vel = get_velocity(player);
        const vel_x = get_x(player_vel);
        const vel_y = get_y(player_vel);
        const current_speed = math_sqrt(vel_x * vel_x + vel_y * vel_y);
        
        const blue_pos = get_position(blue_portal);
        const blue_dx = get_x(player_pos) - get_x(blue_pos);
        const blue_dy = get_y(player_pos) - get_y(blue_pos);
        const blue_distance_sq = blue_dx * blue_dx + blue_dy * blue_dy;
        
        const orange_pos = get_position(orange_portal);
        const orange_dx = get_x(player_pos) - get_x(orange_pos);
        const orange_dy = get_y(player_pos) - get_y(orange_pos);
        const orange_distance_sq = orange_dx * orange_dx + orange_dy * orange_dy;
        
        let portal_threshold = 0.25;
        if (current_speed > 5.0) {
            portal_threshold = 0.35;
        }
        
        if (blue_distance_sq < portal_threshold) {
            if (current_speed > 0.1) {
                teleport_through_portal(player, blue_portal, orange_portal, blue_portal_direction, orange_portal_direction);
            }
        }
        else if (orange_distance_sq < portal_threshold) {
            if (current_speed > 0.1) {
                teleport_through_portal(player, orange_portal, blue_portal, orange_portal_direction, blue_portal_direction);
            }
        }
        
        const exit_threshold = portal_threshold * 1.5;
        if (blue_distance_sq > exit_threshold) {
            player_in_blue_portal = false;
        }
        if (orange_distance_sq > exit_threshold) {
            player_in_orange_portal = false;
        }
    }
    
    if (carrying_object !== cube && blue_portal !== null && orange_portal !== null) {
        const cube_pos = get_position(cube);
        const cube_vel = get_velocity(cube);
        const vel_x = get_x(cube_vel);
        const vel_y = get_y(cube_vel);
        const current_speed = math_sqrt(vel_x * vel_x + vel_y * vel_y);
        
        const blue_pos = get_position(blue_portal);
        const blue_dx = get_x(cube_pos) - get_x(blue_pos);
        const blue_dy = get_y(cube_pos) - get_y(blue_pos);
        const blue_distance_sq = blue_dx * blue_dx + blue_dy * blue_dy;
        
        const orange_pos = get_position(orange_portal);
        const orange_dx = get_x(cube_pos) - get_x(orange_pos);
        const orange_dy = get_y(cube_pos) - get_y(orange_pos);
        const orange_distance_sq = orange_dx * orange_dx + orange_dy * orange_dy;
        
        let portal_threshold = 0.2;
        if (current_speed > 3.0) {
            portal_threshold = 0.3;
        }
        
        if (blue_distance_sq < portal_threshold && !cube_in_blue_portal) {
            if (current_speed > 0.1) {
                teleport_through_portal(cube, blue_portal, orange_portal, blue_portal_direction, orange_portal_direction);
                cube_in_blue_portal = true;
                cube_in_orange_portal = false;
            }
        }
        else if (orange_distance_sq < portal_threshold && !cube_in_orange_portal) {
            if (current_speed > 0.1) {
                teleport_through_portal(cube, orange_portal, blue_portal, orange_portal_direction, blue_portal_direction);
                cube_in_orange_portal = true;
                cube_in_blue_portal = false;
            }
        }
        
        const exit_threshold = portal_threshold * 1.5;
        if (blue_distance_sq > exit_threshold) {
            cube_in_blue_portal = false;
        }
        if (orange_distance_sq > exit_threshold) {
            cube_in_orange_portal = false;
        }
    }
    
    return true;
};

// Player update
const player_update = (self) => {
    if (!game_started) {
        return self; // Safely skip update while still returning self
    }

    update_tutorial_system();
    display_tutorial_gui();
    handle_help_input();
    display_help_button();
    display_help_gui();
    update_transition_system();
    display_loading_screen();
    if (get_custom_prop(player, "transition_freeze")) {
        set_velocity(self, vector3(0, 0, 0));
        return null; // Skip all movement/physics until unfrozen
    }

    
    const move_speed = 3.0;
    const jump_force = 3.5;
    
    // Handle level completion
    if (level_completed) {
        level_complete_timer = level_complete_timer - delta_time();
        
        const next_level_num = current_level + 2;
        const total_levels = get_array_length(maps);
        
        if (current_level + 1 >= total_levels) {
            gui_label("<size=24><color=gold>🎉 GAME COMPLETED! All levels cleared! 🎉</color></size>", 500, 280);
            gui_label("<size=18><color=green>Restarting from Level 1...</color></size>", 500, 320);
        } else {
            gui_label("<size=24><color=green>✅ Level " + (current_level + 1) + " Complete!</color></size>", 500, 280);
            gui_label("<size=18><color=cyan>Loading Level " + next_level_num + "...</color></size>", 500, 320);
        }
        
        if (level_complete_timer <= 0) {
            level_completed = false;
            if (transition_state === "playing") {
                next_level();
            }
        }
            
        return undefined;
    }
    
    if (teleport_cooldown > 0) {
        teleport_cooldown = teleport_cooldown - delta_time();
    }
    
    check_portal_teleportation();
    update_button_door_system();
    
    const current_velocity = get_velocity(self);
    const vel_x = get_x(current_velocity);
    const vel_y = get_y(current_velocity);
    const is_grounded = vel_y < 0.1 && vel_y > -0.1;
    
    let new_vel_x = vel_x;
    let is_moving = false;
    
    if (!portal_creation_mode) {
        if (get_key("A")) {
            let xpos = get_x(get_scale(self));
            let ypos = get_y(get_scale(self));
            set_scale(self, vector3(-math_abs(xpos),ypos,0));
            if (is_grounded) {
                new_vel_x = -move_speed;
            } else {
                new_vel_x = vel_x - move_speed * 0.3 * delta_time() * 10;
                if (new_vel_x < -move_speed * 0.5) {
                    new_vel_x = -move_speed * 0.5;
                }
            }
            player_facing_direction = -1;
            is_moving = true;
        } else if (get_key("D")) {
            let xpos = get_x(get_scale(self));
            let ypos = get_y(get_scale(self));
            set_scale(self, vector3(math_abs(xpos),ypos,0));
            if (is_grounded) {
                new_vel_x = move_speed;
            } else {
                new_vel_x = vel_x + move_speed * 0.3 * delta_time() * 10;
                if (new_vel_x > move_speed * 0.5) {
                    new_vel_x = move_speed * 0.5;
                }
            }
            player_facing_direction = 1;
            is_moving = true;
        }
    }
    
    if (!is_moving && is_grounded) {
        new_vel_x = 0;
    } else if (!is_moving && !is_grounded) {
        new_vel_x = vel_x * 0.98;
    }
    
    set_velocity(self, vector3(new_vel_x, vel_y, 0));
    
    if (!portal_creation_mode && get_key_down("W") && is_grounded) {
        add_impulse_force(self, vector3(0, jump_force, 0));
    }
    
    if (get_key_down("E")) {
        portal_creation_mode = !portal_creation_mode;
    }
    
    if (get_key_down("R")) {
        if (blue_portal !== null) {
            destroy(blue_portal);
            blue_portal = null;
        }
        if (orange_portal !== null) {
            destroy(orange_portal);
            orange_portal = null;
        }
        next_portal_is_blue = true;
        portal_creation_mode = false;
        
        player_in_blue_portal = false;
        player_in_orange_portal = false;
        cube_in_blue_portal = false;
        cube_in_orange_portal = false;
        blue_portal_direction = [0, 0];
        orange_portal_direction = [0, 0];
    }
    
    if (get_key_down("Q")) {
        reset_to_entrance();
    }
    
    if (get_key_down("N")) {
        next_level();
    }
    
    if (get_key_down("F")) {
        const player_pos = get_position(self);
        const cube_pos = get_position(cube);

        // 기존 cube 집기
        const dx = get_x(cube_pos) - get_x(player_pos);
        const dy = get_y(cube_pos) - get_y(player_pos);
        const distance_sq = dx * dx + dy * dy;
        const is_in_facing_direction = (player_facing_direction === 1 && dx > -0.15) || 
                                      (player_facing_direction === -1 && dx < 0.15);
        const is_close_enough = distance_sq < 0.5;
        const is_vertically_close = dy < 0.4 && dy > -0.4;

        // weight_objects 중 가장 가까운 것 찾기
        let nearest_weight = null;
        let nearest_dist = 9999;
        let k = 0;
        while (weight_objects[k] !== undefined) {
            let obj_pos = get_position(weight_objects[k]);
            let dx2 = get_x(obj_pos) - get_x(player_pos);
            let dy2 = get_y(obj_pos) - get_y(player_pos);
            let dist2 = dx2 * dx2 + dy2 * dy2;
            let facing = (player_facing_direction === 1 && dx2 > -0.15) || (player_facing_direction === -1 && dx2 < 0.15);
            let close = dist2 < 0.5;
            let vert = dy2 < 0.4 && dy2 > -0.4;
            if (facing && close && vert && dist2 < nearest_dist) {
                nearest_weight = weight_objects[k];
                nearest_dist = dist2;
            }
            k = k + 1;
        }

        // 집기/내려놓기 로직
        if (carrying_object === null) {
            if (is_in_facing_direction && is_close_enough && is_vertically_close) {
                carrying_object = cube;
            } else if (nearest_weight !== null) {
                carrying_object = nearest_weight;
            }
        } else {
            // 내려놓기: 플레이어 앞에 내려놓음
            const drop_x = get_x(player_pos) + (player_facing_direction * 0.3);
            const drop_y = get_y(player_pos);
            set_position(carrying_object, vector3(drop_x, drop_y, get_z(player_pos)));
            carrying_object = null;
        }
    }
    
    if (carrying_object !== null) {
        const player_pos = get_position(self);
        set_position(carrying_object, vector3(get_x(player_pos), get_y(player_pos) + 0.4, get_z(player_pos)));
        set_velocity(carrying_object, vector3(0, 0, 0));
    }
    
    set_rotation_euler(self, vector3(0, 0, 0));
    
    if (portal_creation_mode) {
        gui_label("<size=20><color=yellow>Portal Mode - WASD + Left Mouse Btn to aim and fire</color></size>", 500, 50);
        
        const next_color = next_portal_is_blue ? "blue" : "orange";
        gui_label("<size=16><color=white>Next portal: </color><color=" + next_color + ">" + next_color + "</color></size>", 500, 80);
        
        gui_label("<size=14><color=lightgray>WASD: Aim direction | Left Mouse Btn: Fire portal | E: Cancel</color></size>", 500, 110);
        
        if (blue_portal !== null && orange_portal !== null) {
            gui_label("<size=12><color=green>Portal status: Blue(" + blue_portal_direction[0] + "," + blue_portal_direction[1] + ") Orange(" + orange_portal_direction[0] + "," + orange_portal_direction[1] + ")</color></size>", 500, 140);
        }
        
        const player_pos = get_position(player);
        
        let aim_x = 0;
        let aim_y = 0;
        
        if (get_key("A")) {
            aim_x = -1;
        }
        if (get_key("D")) {
            aim_x = 1;
        }
        if (get_key("W")) {
            aim_y = 1;
        }
        if (get_key("S")) {
            aim_y = -1;
        }
        
    const can_place_portal = update_aiming_indicator(player_pos, aim_x, aim_y);
    
    if (aim_x !== 0 || aim_y !== 0) {
        if (can_place_portal) {
            gui_label("<size=14><color=green>Ready to place portal: " + 
                (aim_x === -1 ? "Left " : aim_x === 1 ? "Right " : "") +
                (aim_y === 1 ? "Up" : aim_y === -1 ? "Down" : "") + 
                "</color></size>", 500, 170);
        } else {
            gui_label("<size=14><color=red>No valid surface: " + 
                (aim_x === -1 ? "Left " : aim_x === 1 ? "Right " : "") +
                (aim_y === 1 ? "Up" : aim_y === -1 ? "Down" : "") + 
                "</color></size>", 500, 170);
        }
    }
        
        if (aim_x !== 0 || aim_y !== 0) {
            gui_label("<size=14><color=cyan>Aiming: " + 
                (aim_x === -1 ? "Left " : aim_x === 1 ? "Right " : "") +
                (aim_y === 1 ? "Up" : aim_y === -1 ? "Down" : "") + 
                "</color></size>", 500, 170);
        }
        
        if (get_key_down("LeftMouseBtn") && (aim_x !== 0 || aim_y !== 0)) {
        const base_x = get_x(player_pos);
        const base_y = get_y(player_pos);
        const result = find_first_block_in_direction(base_x, base_y, aim_x, aim_y);
        const found = result[2] === 1;
        
        if (found) {
            const portal_x = result[0];
            const portal_y = result[1];
            const normal_x = result[3];
            const normal_y = result[4];
            
            create_portal(next_portal_is_blue, vector3(portal_x, portal_y, 0), normal_x, normal_y);
            next_portal_is_blue = !next_portal_is_blue;
            portal_creation_mode = false;
            
            // Clear aiming indicator when portal is placed
            if (aiming_indicator !== null) {
                destroy(aiming_indicator);
                aiming_indicator = null;
            }
        } else {
            gui_label("<size=16><color=red>No block found in that direction!</color></size>", 500, 200);
        }
    }
} else {
    // Clear aiming indicator when not in portal mode
    if (aiming_indicator !== null) {
        destroy(aiming_indicator);
        aiming_indicator = null;
    }
    // ... rest of the else block remains the same
}
        // Debug: Show player and cube positions
        const player_pos = get_position(self);
        const cube_pos = get_position(cube);
        //gui_label("<size=12><color=cyan>Player: (" + math_floor(get_x(player_pos) * 10) / 10 + ", " + math_floor(get_y(player_pos) * 10) / 10 + ")</color></size>", 50, 140);
        //gui_label("<size=12><color=orange>Cube: (" + math_floor(get_x(cube_pos) * 10) / 10 + ", " + math_floor(get_y(cube_pos) * 10) / 10 + ")</color></size>", 50, 170);
        

        if (get_array_length(buttons[0]) > 0 || get_array_length(buttons[1]) > 0 || get_array_length(buttons[2]) > 0) {
            let buttons_pressed = 0;
            let total_buttons = 0;
            for (let i = 0; i < 3; i = i + 1) {
                if (button_states[i]) {
                    buttons_pressed = buttons_pressed + 1;
                }
                if (get_array_length(buttons[i]) > 0) {
                    total_buttons = total_buttons + 1;
                }
            }
            
            const button_color = buttons_pressed > 0 ? "green" : "red";
            gui_label("<size=14><color=orange>" + "Button Pairs: " + buttons_pressed + "/" + total_buttons + " activated</color></size>", 50, 830);
            


            for (let i = 0; i < 3; i = i + 1) {
                if (get_array_length(doors[i]) > 0) {
                    const door_status = door_is_open[i] ? "OPEN" : "CLOSED";
                    const door_color = door_is_open[i] ? "green" : "red";
                    const door_type = i === 0 ? "Blue" : i === 1 ? "Green" : "Red";
                    gui_label("<size=12><color=white" + door_color + ">" + door_type + " Door: " + door_status + "</color></size>", 50, 850 + (i * 20));
                }
            }
        }
        
        const current_velocity_check = get_velocity(self);
        const current_speed = math_sqrt(get_x(current_velocity_check) * get_x(current_velocity_check) + get_y(current_velocity_check) * get_y(current_velocity_check));
        if (current_speed > 3.0) {
            gui_label("<size=14><color=yellow>Speed: " + math_floor(current_speed * 10) / 10 + " (Portal Loop Active!)</color></size>", 500, 110);
        }
        
        if (teleport_cooldown > 0) {
            gui_label("<size=12><color=yellow>Teleport cooldown: " + teleport_cooldown + "</color></size>", 500, 140);
        }
    };


// Player collision
const player_collision = (self, other) => {
    if (outlet !== null && same_gameobject(other, outlet)) {
        if (carrying_object === cube && !level_completed) {
            level_completed = true;
            level_complete_timer = 2.0;
            
        } else if (!level_completed) {
            gui_label("<size=20><color=red>you need the mystery box to complete this level!</color></size>", 500, 300);
            gui_label("<size=16><color=yellow>Find the mystery box and bring it here.</color></size>", 500, 330);
        }
    }
};

// Function binding

set_start(timer_object,timer_start);
set_update(timer_object, timer_update);
set_start(player, player_start);
set_update(player, player_update);
on_collision_enter(player, player_collision);

set_start(bg_lab, bg_lab_start);
set_start(cube, cube_start);

const cube_pos = find_cube_position(current_map);
set_position(cube, vector3(cube_pos[0], cube_pos[1], 0));

bg_audio;
build_game();