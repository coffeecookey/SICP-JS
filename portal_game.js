// Portal Game - Physics-based Portal System with Multi-Level Support
import {
    init_unity_academy_2d, set_start, set_update, instantiate_sprite, 
    set_position, get_position, get_key_down, get_key, translate_world,
    apply_rigidbody, add_impulse_force, get_velocity, set_velocity,remove_collider_components,
    on_collision_enter, same_gameobject, get_main_camera_following_target,
    copy_position, destroy, vector3, get_x, get_y, get_z,set_custom_prop, gui_button,
    get_custom_prop,set_scale, get_scale, set_rotation_euler, delta_time, gui_label
} from "unity_academy";

init_unity_academy_2d();

const bg_lab = instantiate_sprite('https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/bg-lab4.png');

const bg_lab_start = (self) => {
    set_scale(self,vector3(2,1.5,0));
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
    for (let i = 0; i < times; i = i + 1) {
        result = result + str;
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
// Legend: 0=empty, 1=wall, 2=exit, 3=entrance, 4=button, 5=door, 6=mystery box spawn

// Level 1 - Basic Portal Introduction (Gap crossing)
const map1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
const map4 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Map array for easy level management
const maps = [map1, map2, map3, map4];

// Size settings
const tileSize = 0.4;
const platformScale = 0.008; 
const playerScale = 0.18;
const cubeScale = 0.2;
const goalScale = 0.1;
const portalScale = 0.1;

// Game variables
let platforms = [];
let platform_positions = [];
let platform_count = 0;
let aiming_indicator = null;
let show_tutorial = false;
let show_help = false;
let tutorial_step = 0;
let tutorial_timer = 0;

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

// Portal teleportation status tracking
let player_in_blue_portal = false;
let player_in_orange_portal = false;
let cube_in_blue_portal = false;
let cube_in_orange_portal = false;

// Game state with loading screen support
let current_level = 0;
let current_map = maps[current_level];
let level_complete_timer = 0;
let level_completed = false;
let loading_screen_active = false;
let loading_screen_timer = 0;
let loading_screen_duration = 2.0;
let freeze_player_movement = false;
let next_level_to_load = 0;

// New game mechanics
let buttons = [];
let doors = [];
let button_states = [];
let door_is_open = false;

// ... existing code ...

// Loading screen display function
const display_loading_screen = () => {
    if (loading_screen_active) {
        // Dark background overlay
        const bg_width = get_canvas_width();
        const bg_height = get_canvas_height();
        
        // Create loading screen background
        for (let i = 0; i < 30; i = i + 1) {
            for (let j = 0; j < 40; j = j + 1) {
                gui_label("█", i * 25, j * 15, "rgba(0,0,0,0.9)", "12px monospace");
            }
        }
        
        // Loading animation
        const loading_dots = math_floor(get_time() * 3) % 4;
        let dots = "";
        for (let i = 0; i < loading_dots; i = i + 1) {
            dots = dots + ".";
        }
        
        // Loading text
        gui_label("<size=36><color=white>LOADING" + dots + "</color></size>", 300, 250);
        
        // Level transition info
        const next_level_num = next_level_to_load + 1;
        const total_levels = get_array_length(maps);
        
        if (next_level_to_load >= total_levels) {
            gui_label("<size=24><color=gold>🎉 GAME COMPLETED! 🎉</color></size>", 300, 300);
            gui_label("<size=18><color=green>Restarting from Level 1...</color></size>", 300, 340);
        } else {
            gui_label("<size=24><color=cyan>Entering Level " + next_level_num + "</color></size>", 300, 300);
            gui_label("<size=18><color=white>Preparing new challenges...</color></size>", 300, 340);
        }
        
        // Progress bar
        const progress = (loading_screen_duration - loading_screen_timer) / loading_screen_duration;
        const bar_width = 300;
        const bar_height = 20;
        const bar_x = 250;
        const bar_y = 380;
        
        // Progress bar background
        for (let i = 0; i < bar_width / 4; i = i + 1) {
            gui_label("▓", bar_x + i * 4, bar_y, "rgba(100,100,100,0.8)", "12px monospace");
        }
        
        // Progress bar fill
        const fill_width = bar_width * progress;
        for (let i = 0; i < fill_width / 4; i = i + 1) {
            gui_label("█", bar_x + i * 4, bar_y, "rgba(0,200,255,0.9)", "12px monospace");
        }
        
        // Percentage
        const percentage = math_floor(progress * 100);
        gui_label("<size=16><color=white>" + percentage + "%</color></size>", 400, 410);
        
        // Tips during loading
        const tips = [
            "💡 Use E to enter portal mode",
            "💡 Aim with WASD and click to place portals",
            "💡 Press F to pick up and drop objects",
            "💡 Buttons open doors when pressed",
            "💡 Bring the mystery box to the exit to complete levels"
        ];
        
        const tip_index = math_floor(get_time() * 0.5) % get_array_length(tips);
        gui_label("<size=14><color=yellow>" + tips[tip_index] + "</color></size>", 200, 450);
        
        return true;
    }
    return false;
};

// Modified next level function
const next_level = () => {
    next_level_to_load = current_level + 1;
    if (next_level_to_load >= get_array_length(maps)) {
        next_level_to_load = 0;
    }
    
    // Start loading screen
    loading_screen_active = true;
    loading_screen_timer = loading_screen_duration;
    freeze_player_movement = true;
    
    // Stop player movement immediately
    set_velocity(player, vector3(0, 0, 0));
    if (carrying_object !== null) {
        set_velocity(carrying_object, vector3(0, 0, 0));
    }
};

// Modified load level function with smooth transition
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
    
    // Clear buttons and doors
    for (let i = 0; i < get_array_length(buttons); i = i + 1) {
        if (buttons[i] !== undefined) {
            destroy(buttons[i]);
        }
    }
    for (let i = 0; i < get_array_length(doors); i = i + 1) {
        if (doors[i] !== undefined) {
            destroy(doors[i]);
        }
    }
    
    // Reset arrays
    platforms = [];
    platform_positions = [];
    platform_count = 0;
    buttons = [];
    doors = [];
    button_states = [];
    door_is_open = false;
    
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
                
            } else if (level_map[row][col] === 4) {
                // Button
                const button = instantiate_sprite("https://via.placeholder.com/50x50/ff0000/ffffff?text=BTN");
                buttons[button_count] = button;
                button_states[button_count] = false;
                
                set_start(button, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(0.2, 0.2, 0));
                });
                
                button_count = button_count + 1;
                
            } else if (level_map[row][col] === 5) {
                // Door
                const door = instantiate_sprite("https://via.placeholder.com/50x50/8b4513/ffffff?text=DOOR");
                doors[door_count] = door;
                platform_positions[platform_count] = [x, y];
                
                set_start(door, (self) => {
                    set_position(self, vector3(x, y, 0));
                    set_scale(self, vector3(platformScale, platformScale, 0));
                });
                
                platform_count = platform_count + 1;
                door_count = door_count + 1;
                
            } // Note: 6 (mystery box spawn) is handled by repositioning in reset_to_entrance
        }
    }
    
    // Update current level after successful load
    current_level = next_level_to_load;
    current_map = level_map;
};

// ... existing code ...

// Modified reset to entrance function
const reset_to_entrance = () => {
    const entrance_pos = find_entrance_position(maps[current_level]);
    const cube_pos = find_cube_position(maps[current_level]);
    
    // Smoothly position player and cube
    set_position(player, vector3(entrance_pos[0], entrance_pos[1], 0));
    set_position(cube, vector3(cube_pos[0], cube_pos[1], 0));
    
    // Reset velocities
    set_velocity(player, vector3(0, 0, 0));
    set_velocity(cube, vector3(0, 0, 0));
    
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
    
    // Reset button and door states
    door_is_open = false;
    for (let i = 0; i < get_array_length(button_states); i = i + 1) {
        button_states[i] = false;
    }
    
    // Enable player movement
    freeze_player_movement = false;
};

// ... existing code ...

// Modified player update function
const player_update = (self) => {
    // Display loading screen first (it will return true if active)
    if (display_loading_screen()) {
        // Update loading screen timer
        loading_screen_timer = loading_screen_timer - delta_time();
        
        if (loading_screen_timer <= 0) {
            // Loading complete, transition to new level
            loading_screen_active = false;
            load_level(maps[next_level_to_load]);
            reset_to_entrance();
        }
        
        return undefined; // Don't process any other updates during loading
    }
    
    update_tutorial_system();
    handle_help_input();
    display_tutorial_gui();
    display_help_gui();
    display_help_button();
    
    const move_speed = 3.0;
    const jump_force = 3.5;
    copy_position(self, camera_target, vector3(0, 1.2, 0));
    
    // Handle level completion
    if (level_completed) {
        level_complete_timer = level_complete_timer - delta_time();
        
        const next_level_num = current_level + 2;
        const total_levels = get_array_length(maps);
        
        if (current_level + 1 >= total_levels) {
            gui_label("<size=24><color=gold>🎉 LEVEL " + (current_level + 1) + " COMPLETE! 🎉</color></size>", 500, 280);
            gui_label("<size=18><color=green>Preparing to restart...</color></size>", 500, 320);
        } else {
            gui_label("<size=24><color=green>✅ Level " + (current_level + 1) + " Complete!</color></size>", 500, 280);
            gui_label("<size=18><color=cyan>Preparing Level " + next_level_num + "...</color></size>", 500, 320);
        }
        
        if (level_complete_timer <= 0) {
            level_completed = false;
            next_level();
        }
        
        return undefined;
    }
    
    // Don't process movement if player is frozen
    if (freeze_player_movement) {
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
    
    if (!portal_creation_mode && !freeze_player_movement) {
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
    
    if (!portal_creation_mode && !freeze_player_movement && get_key_down("W") && is_grounded) {
        add_impulse_force(self, vector3(0, jump_force, 0));
    }
    
    if (!freeze_player_movement && get_key_down("E")) {
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
    
    if (!freeze_player_movement && get_key_down("F")) {
        const player_pos = get_position(self);
        const cube_pos = get_position(cube);
        
        const dx = get_x(cube_pos) - get_x(player_pos);
        const dy = get_y(cube_pos) - get_y(player_pos);
        const distance_sq = dx * dx + dy * dy;
        
        const is_in_facing_direction = (player_facing_direction === 1 && dx > -0.15) || 
                                      (player_facing_direction === -1 && dx < 0.15);
        const is_close_enough = distance_sq < 0.5;
        const is_vertically_close = dy < 0.4 && dy > -0.4;
        
        if (is_in_facing_direction && is_close_enough && is_vertically_close) {
            if (carrying_object === null) {
                carrying_object = cube;
            } else {
                const drop_x = get_x(player_pos) + (player_facing_direction * 0.3);
                const drop_y = get_y(player_pos);
                set_position(carrying_object, vector3(drop_x, drop_y, get_z(player_pos)));
                carrying_object = null;
            }
        }
    }
    
    if (carrying_object !== null && !freeze_player_movement) {
        const player_pos = get_position(self);
        set_position(carrying_object, vector3(get_x(player_pos), get_y(player_pos) + 0.4, get_z(player_pos)));
        set_velocity(carrying_object, vector3(0, 0, 0));
    }
    
    set_rotation_euler(self, vector3(0, 0, 0));
    
    if (portal_creation_mode && !freeze_player_movement) {
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
    }
    
    // Debug: Show player and cube positions
    const player_pos = get_position(self);
    const cube_pos = get_position(cube);
    gui_label("<size=12><color=cyan>Player: (" + math_floor(get_x(player_pos) * 10) / 10 + ", " + math_floor(get_y(player_pos) * 10) / 10 + ")</color></size>", 50, 140);
    gui_label("<size=12><color=orange>Cube: (" + math_floor(get_x(cube_pos) * 10) / 10 + ", " + math_floor(get_y(cube_pos) * 10) / 10 + ")</color></size>", 50, 170);
    
    if (get_array_length(buttons) > 0) {
        let buttons_pressed = 0;
        for (let i = 0; i < get_array_length(button_states); i = i + 1) {
            if (button_states[i]) {
                buttons_pressed = buttons_pressed + 1;
            }
        }
        
        const button_color = buttons_pressed > 0 ? "green" : "red";
        gui_label("<size=14><color=" + button_color + ">Buttons: " + buttons_pressed + "/" + get_array_length(buttons) + " pressed</color></size>", 50, 80);
        
        if (get_array_length(doors) > 0) {
            const door_status = door_is_open ? "OPEN" : "CLOSED";
            const door_color = door_is_open ? "green" : "red";
            gui_label("<size=14><color=" + door_color + ">Door: " + door_status + "</color></size>", 50, 110);
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

// Game objects
const player = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/s1.png");
const cube = instantiate_sprite("https://raw.githubusercontent.com/coffeecookey/SICP-JS/main/Assets/card.png");
let inlet = null;
let outlet = null;

// Camera
const camera_target = get_main_camera_following_target();

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

// Add this function to display tutorial messages
const display_tutorial_gui = () => {
    if (show_tutorial) {
        // Tutorial title
        gui_label("<size=30><color=white>PORTAL TUTORIAL - LEVEL 1</color></size>", 1400, 10);
        
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
            gui_label("<color=white> - Use WASD to aim. You can press 2 keys at a time to aim better</color>", 800, 790);
            gui_label("<color=white> - The red crosshair will show you where the portal will be placed</color>", 800, 820);
            gui_label("<color=white><b> - Enter portal mode, aim, click the 'Left Mouse button' and create portal to continue</b></color>", 800, 850);
            
            
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
        for (let i = 0; i < 5; i=i+1) {
            gui_label(repeat_string("█",50), bg_x - i, bg_y - i, "rgba(0,0,0,0.8)", "12px monospace");
        }
        
        // Help content
        gui_label("GAME CONTROLS & HELP", bg_x + 10, bg_y + 30, "white", "18px Arial");
        gui_label(repeat_string("─",30), bg_x + 10, bg_y + 35, "white", "12px monospace");
        
        gui_label("Movement:", bg_x + 10, bg_y + 60, "yellow", "14px Arial");
        gui_label("• Arrow Keys or WASD to move", bg_x + 20, bg_y + 80, "white", "12px Arial");
        gui_label("• SPACE to jump", bg_x + 20, bg_y + 100, "white", "12px Arial");
        
        gui_label("Portals:", bg_x + 10, bg_y + 130, "yellow", "14px Arial");
        gui_label("• Hold Q to enter portal mode", bg_x + 20, bg_y + 150, "white", "12px Arial");
        gui_label("• Move mouse to aim", bg_x + 20, bg_y + 170, "white", "12px Arial");
        gui_label("• Click to create portal", bg_x + 20, bg_y + 190, "white", "12px Arial");
        gui_label("• Portals connect blue ↔ orange", bg_x + 20, bg_y + 210, "white", "12px Arial");
        
        gui_label("Other:", bg_x + 10, bg_y + 240, "yellow", "14px Arial");
        gui_label("• R to reset level", bg_x + 20, bg_y + 260, "white", "12px Arial");
        gui_label("• ESC to close this help", bg_x + 20, bg_y + 280, "white", "12px Arial");
        
        // Close button
        if (gui_button("Close Help", bg_x + bg_width - 100, bg_y + 10, 80, 30)) {
            show_help = false;
        }
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
    // Initial position will be overridden by load_level
    set_position(self, vector3(-4, 1.5, 0));
    set_scale(self, vector3(cubeScale, cubeScale, 1));
    apply_rigidbody(self);
};

// Button and door system
const update_button_door_system = () => {
    let any_button_pressed = false;
    
    for (let i = 0; i < get_array_length(buttons); i = i + 1) {
        if (buttons[i] !== undefined) {
            const button_pos = get_position(buttons[i]);
            const button_x = get_x(button_pos);
            const button_y = get_y(button_pos);
            
            const player_pos = get_position(player);
            const player_x = get_x(player_pos);
            const player_y = get_y(player_pos);
            
            const cube_pos = get_position(cube);
            const cube_x = get_x(cube_pos);
            const cube_y = get_y(cube_pos);
            
            const player_on_button = (player_x - button_x) * (player_x - button_x) + (player_y - button_y) * (player_y - button_y) < 0.3;
            const cube_on_button = (cube_x - button_x) * (cube_x - button_x) + (cube_y - button_y) * (cube_y - button_y) < 0.3;
            
            if (player_on_button || cube_on_button) {
                button_states[i] = true;
                any_button_pressed = true;
                set_scale(buttons[i], vector3(0.15, 0.15, 0));
            } else {
                button_states[i] = false;
                set_scale(buttons[i], vector3(0.2, 0.2, 0));
            }
        }
    }
    
    const was_open = door_is_open;
    door_is_open = any_button_pressed;
    
    if (was_open !== door_is_open) {
        for (let i = 0; i < get_array_length(doors); i = i + 1) {
            if (doors[i] !== undefined) {
                if (door_is_open) {
                    set_scale(doors[i], vector3(0, 0, 0));
                } else {
                    set_scale(doors[i], vector3(platformScale, platformScale, 0));
                }
            }
        }
    }
};

// Portal direction calculation
const find_first_block_in_direction = (start_x, start_y, aim_x, aim_y) => {
    const max_distance = 20;
    const step = 0.05;
    
    let current_distance = 0;
    
    while (current_distance < max_distance) {
        const test_x = start_x + (aim_x * current_distance);
        const test_y = start_y + (aim_y * current_distance);
        
        let i = 0;
        while (i < platform_count) {
            const block_x = platform_positions[i][0];
            const block_y = platform_positions[i][1];
            
            const dx = test_x - block_x;
            const dy = test_y - block_y;
            const distance_to_block = dx * dx + dy * dy;
            
            // Check if this is a door and if it's open
            let is_door = false;
            let door_open = false;
            
            for (let j = 0; j < get_array_length(doors); j = j + 1) {
                if (doors[j] !== undefined) {
                    const door_pos = get_position(doors[j]);
                    const door_dx = block_x - get_x(door_pos);
                    const door_dy = block_y - get_y(door_pos);
                    const door_distance = door_dx * door_dx + door_dy * door_dy;
                    
                    if (door_distance < 0.1) {
                        is_door = true;
                        door_open = door_is_open;
                        break;
                    }
                }
            }
            
            if (is_door && door_open) {
                i = i + 1;
                continue;
            }
            
            if (distance_to_block < 0.15) {
                let portal_x = block_x;
                let portal_y = block_y;
                let normal_x = 0;
                let normal_y = 0;
                
                if (math_abs(aim_x) > math_abs(aim_y)) {
                    if (aim_x > 0) {
                        portal_x = block_x - 0.25;
                        normal_x = -1;
                    } else {
                        portal_x = block_x + 0.25;
                        normal_x = 1;
                    }
                } else {
                    if (aim_y > 0) {
                        portal_y = block_y - 0.25;
                        normal_y = -1;
                    } else {
                        portal_y = block_y + 0.25;
                        normal_y = 1;
                    }
                }
                
                return [portal_x, portal_y, 1, normal_x, normal_y];
            }
            
            i = i + 1;
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
        
        const safe_distance = 0.5;
        const exit_x = get_x(to_pos) + (to_direction[0] * safe_distance);
        const exit_y = get_y(to_pos) + (to_direction[1] * safe_distance);
        
        set_position(object, vector3(exit_x, exit_y, get_z(to_pos)));
        set_velocity(object, vector3(new_vel_x, new_vel_y, 0));
        
        teleport_cooldown = 0.02;
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
        
        let portal_threshold = 0.15;
        if (current_speed > 5.0) {
            portal_threshold = 0.25;
        }
        
        if (blue_distance_sq < portal_threshold && !player_in_blue_portal) {
            if (current_speed > 0.1) {
                teleport_through_portal(player, blue_portal, orange_portal, blue_portal_direction, orange_portal_direction);
                player_in_blue_portal = true;
                player_in_orange_portal = false;
            }
        }
        else if (orange_distance_sq < portal_threshold && !player_in_orange_portal) {
            if (current_speed > 0.1) {
                teleport_through_portal(player, orange_portal, blue_portal, orange_portal_direction, blue_portal_direction);
                player_in_orange_portal = true;
                player_in_blue_portal = false;
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
        
        let portal_threshold = 0.15;
        if (current_speed > 3.0) {
            portal_threshold = 0.2;
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