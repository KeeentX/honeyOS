// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//   tauri::Builder::default()
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::process::{Command, Stdio};
// use std::io::{BufRead, BufReader};
// use std::thread;
// use std::sync::mpsc;
// use tauri:Manager;

// fn main() {
//     // Create a channel to communicate between threads
//     let (tx, rx) = mpsc::channel();

//     // Spawn a thread to run the Python script
//     thread::spawn(move || {
//         let mut child = Command::new("python")
//             .arg("../vad.py")
//             .stdout(Stdio::piped())
//             .spawn()
//             .expect("Failed to start child process");

//         let stdout = child.stdout.take().expect("Failed to capture stdout");
//         let reader = BufReader::new(stdout);

//         for line in reader.lines() {
//             let line = line.expect("Failed to read line from child process");
//             tx.send(line).expect("Failed to send line to main thread");
//         }

//         let _ = child.wait().expect("Child process wasn't running");
//     });

//     // Spawn a thread to print lines from the Python script
//     thread::spawn(move || {
//       for line in rx {
//           println!("{}", line);
//       }
//     });

//     // Run the Tauri application in the main thread
//     let tauri_app = tauri::Builder::default()
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");

    

//     // Block the main thread until the Tauri application exits
// }


#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::thread;
use std::sync::mpsc;
use tauri::Manager;

fn main() {
    let context = tauri::generate_context!();
    let _app = tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let (tx, rx) = mpsc::channel();

            // Spawn a thread to run the Python script
            thread::spawn(move || {
                let mut child = Command::new("python")
                    .arg("../vad.py")  // Adjust the path to your Python script as necessary
                    .stdout(Stdio::piped())
                    .spawn()
                    .expect("Failed to start child process");

                let stdout = child.stdout.take().expect("Failed to capture stdout");
                let reader = BufReader::new(stdout);

                for line in reader.lines() {
                    let line = line.expect("Failed to read line from child process");
                    tx.send(line).expect("Failed to send line to main thread");
                }

                let _ = child.wait().expect("Child process wasn't running");
            });

            // Spawn a thread to listen for lines from the Python script and send them to the front end
            thread::spawn(move || {
                for line in rx {
                    app_handle.emit_all("transcribed_text", &line).expect("Failed to send transcribed text to front end");
                }
            });

            Ok(())
        })
        .run(context)
        .expect("error while running tauri application");

    // The Tauri application now runs until it is closed, with the event handling set up during initialization
}
