var obj = JSON.parse($response.body);

obj= {
  "sourceURL": "https://cdn.altstore.io/file/altstore/apps.json",
  "apps": [
    {
      "version": "1.0.1",
      "versionDate": "2019-09-28T03:00:00-07:00",
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65605563-2f009d00-df5e-11e9-9b40-1f36135d5c80.PNG",
        "https://user-images.githubusercontent.com/705880/65605569-30ca6080-df5e-11e9-8dfb-15ebb00e10cb.PNG",
        "https://user-images.githubusercontent.com/705880/65605577-332cba80-df5e-11e9-9f00-b369ce974f71.PNG"
      ],
      "bundleIdentifier": "com.rileytestut.AltStore",
      "iconURL": "https://user-images.githubusercontent.com/705880/65270980-1eb96f80-dad1-11e9-9367-78ccd25ceb02.png",
      "tintColor": "018084",
      "versionDescription": "Fixes Patreon bugs.",
      "size": 3481256,
      "permissions": [
        {
          "type": "background-fetch",
          "usageDescription": "AltStore periodically refreshes apps in the background to prevent them from expiring."
        },
        {
          "type": "background-audio",
          "usageDescription": "Allows AltStore to run longer than 30 seconds when refreshing apps in background."
        }
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "AltStore is an alternative app store for non-jailbroken devices. 

This initial release of AltStore allows you to install Delta, an all-in-one emulator for iOS, with support for installing 3rd party apps coming soon.",
      "name": "AltStore",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/altstore.ipa"
    },
    {
      "version": "1.0.1b",
      "versionDate": "2019-09-28T03:00:00-07:00",
      "beta": true,
      "bundleIdentifier": "com.rileytestut.AltStore.Beta",
      "iconURL": "https://user-images.githubusercontent.com/705880/65270980-1eb96f80-dad1-11e9-9367-78ccd25ceb02.png",
      "tintColor": "018084",
      "versionDescription": "- Adds support for sideloading apps via "Open In..."
- Fixes Patreon bugs",
      "size": 3481256,
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65605563-2f009d00-df5e-11e9-9b40-1f36135d5c80.PNG",
        "https://user-images.githubusercontent.com/705880/65605569-30ca6080-df5e-11e9-8dfb-15ebb00e10cb.PNG",
        "https://user-images.githubusercontent.com/705880/65605577-332cba80-df5e-11e9-9f00-b369ce974f71.PNG"
      ],
      "permissions": [
        {
          "type": "background-fetch",
          "usageDescription": "AltStore periodically refreshes apps in the background to prevent them from expiring."
        },
        {
          "type": "background-audio",
          "usageDescription": "Allows AltStore to run longer than 30 seconds when refreshing apps in background."
        }
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "AltStore is an alternative app store for non-jailbroken devices. 

This beta release of SideloadStore allows you to install Delta as well as any app (.ipa) directly from the Files app.",
      "name": "AltStore",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/altstore-beta.ipa"
    },
    {
      "subtitle": "Classic games in your pocket.",
      "version": "1.0",
      "versionDate": "2019-09-28T12:00:00-07:00",
      "permissions": [
        {
          "type": "photos",
          "usageDescription": "Allows Delta to use images from your Photo Library as game artwork."
        }
      ],
      "bundleIdentifier": "com.rileytestut.Delta",
      "iconURL": "https://user-images.githubusercontent.com/705880/63391976-4d311700-c37a-11e9-91a8-4fb0c454413d.png",
      "tintColor": "8A28F7",
      "versionDescription": "Initial version.",
      "size": 23075523,
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65600448-f7d9be00-df54-11e9-9e3e-d4c31296da94.PNG",
        "https://user-images.githubusercontent.com/705880/65813009-f2ae8600-e183-11e9-9eb7-704effc11173.png",
        "https://user-images.githubusercontent.com/705880/65601117-58b5c600-df56-11e9-9c19-9a5ba5da54cf.PNG",
        "https://user-images.githubusercontent.com/705880/65601125-5b182000-df56-11e9-9e7e-261480e893c0.PNG"
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "Delta is an all-in-one emulator for iOS. Delta builds upon the strengths of its predecessor, GBA4iOS, while expanding to include support for more game systems such as NES, SNES, and N64.

FEATURES

Supported Game Systems
• Nintendo Entertainment System
• Super Nintendo Entertainment System
• Nintendo 64
• Game Boy (Color)
• Game Boy Advance
• And plenty more to come!

Controller Support
• Supports PS4, Xbox One S, and MFi game controllers.
• Supports bluetooth (and wired) keyboards, as well as the Apple Smart Keyboard.
• Completely customize button mappings on a per-system, per-controller basis.
• Map buttons to special “Quick Save”, “Quick Load,” and “Fast Forward” actions.

Save States
• Save and load save states for any game from the pause menu.
• Lock save states to prevent them from being accidentally overwritten.
• Automatically makes backup save states to ensure you never lose your progress.
• Support for “Quick Saves,” save states that can be quickly saved/loaded with a single button press (requires external controller).

Cheats
• Supports various types of cheat codes for each supported system:
• NES: Game Genie
• SNES: Game Genie, Pro Action Replay
• N64: GameShark
• GBC: Game Genie, GameShark
• GBA: Action Replay, Code Breaker, GameShark

Delta Sync
• Sync your games, game saves, save states, cheats, controller skins, and controller mappings between devices.
• View version histories of everything you sync and optionally restore them to earlier versions.
• Supports both Google Drive and Dropbox.

Custom Controller Skins
• Beautiful built-in controller skins for all systems.
• Import controller skins made by others, or even make your own to share with the world!

Hold Button
• Choose buttons for Delta to hold down on your behalf, freeing up your thumbs to press other buttons instead.
• Perfect for games that typically require one button be held down constantly (ex: run button in Mario games, or the A button in Mario Kart).

Fast Forward
• Speed through slower parts of games by running the game much faster than normal.
• Easily enable or disable from the pause menu, or optionally with a mapped button on an external controller.

3D/Haptic Touch
• Use 3D or Haptic Touch to “peek” at games, save states, and cheat codes.
• App icon shortcuts allow quick access to your most recently played games, or optionally customize the shortcuts to always include certain games.

Game Artwork
• Automatically displays appropriate box art for imported games.
• Change a game’s artwork to anything you want, or select from the built-in game artwork database.

Misc.
• Gyroscope support for WarioWare: Twisted!
• Support for delta:// URL scheme to jump directly into a specific game.

**Delta and AltStore LLC are in no way affiliated with Nintendo. The name "Nintendo" and all associated game console names are registered trademarks of Nintendo Co., Ltd.**",
      "name": "Delta",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/delta.ipa"
    },
    {
      "subtitle": "Classic games in your pocket.",
      "version": "1.0b",
      "versionDate": "2019-09-28T12:00:00-07:00",
      "beta": true,
      "bundleIdentifier": "com.rileytestut.Delta.Beta",
      "iconURL": "https://user-images.githubusercontent.com/705880/63391976-4d311700-c37a-11e9-91a8-4fb0c454413d.png",
      "tintColor": "8A28F7",
      "versionDescription": "Includes initial support for DS games.",
      "size": 23075071,
      "permissions": [
        {
          "type": "photos",
          "usageDescription": "Allows Delta to use images from your Photo Library as game artwork."
        }
      ],
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65600448-f7d9be00-df54-11e9-9e3e-d4c31296da94.PNG",
        "https://user-images.githubusercontent.com/705880/65601942-e5ad4f00-df57-11e9-9255-1463e0296e46.PNG",
        "https://user-images.githubusercontent.com/705880/65813009-f2ae8600-e183-11e9-9eb7-704effc11173.png",
        "https://user-images.githubusercontent.com/705880/65601117-58b5c600-df56-11e9-9c19-9a5ba5da54cf.PNG"
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "The next console for Delta is coming: this beta version of Delta brings support for playing DS games!

DS support currently includes:
• Playing DS games
• Save States
• Hold Button

Features I'm still working on:
• Fast Forward
• Cheats
• Controller skin (using placeholder controller skin for now)

Please report any issues you find to support@altstore.io. Thanks!",
      "name": "Delta",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/delta-beta.ipa"
    },
    {
      "subtitle": "The 80s in your pocket.",
      "version": "1.0",
      "versionDate": "2019-09-25",
      "permissions": [
        {
          "type": "photos",
          "usageDescription": "Allows Delta to use images from your Photo Library as game artwork."
        }
      ],
      "bundleIdentifier": "com.rileytestut.Delta.Lite",
      "iconURL": "https://user-images.githubusercontent.com/705880/63391976-4d311700-c37a-11e9-91a8-4fb0c454413d.png",
      "tintColor": "8A28F7",
      "versionDescription": "Initial version.",
      "size": 15256861,
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65599574-07580780-df53-11e9-97a3-b27141c8cae8.PNG",
        "https://user-images.githubusercontent.com/705880/65599570-04f5ad80-df53-11e9-914a-8c42ac4805b0.PNG"
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "Delta Lite brings NES games to iOS.",
      "name": "Delta Lite",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/delta-lite.ipa"
    },
    {
      "subtitle": "The 80s (and 90s) in your pocket.",
      "version": "1.0b",
      "versionDate": "2019-09-25",
      "beta": true,
      "bundleIdentifier": "com.rileytestut.Delta.Lite.Beta",
      "iconURL": "https://user-images.githubusercontent.com/705880/63391976-4d311700-c37a-11e9-91a8-4fb0c454413d.png",
      "tintColor": "8A28F7",
      "versionDescription": "Adds support for GBC games in addition to NES.",
      "size": 16509767,
      "permissions": [
        {
          "type": "photos",
          "usageDescription": "Allows Delta to use images from your Photo Library as game artwork."
        }
      ],
      "screenshotURLs": [
        "https://user-images.githubusercontent.com/705880/65599562-fe673600-df52-11e9-9cfb-b60a11568baf.PNG",
        "https://user-images.githubusercontent.com/705880/65599567-01fabd00-df53-11e9-8654-f075c0f32c59.PNG"
      ],
      "developerName": "Riley Testut",
      "localizedDescription": "Delta Lite brings NES and GBC games to iOS.",
      "name": "Delta Lite",
      "downloadURL": "https://f000.backblazeb2.com/file/altstore/delta-lite-beta.ipa"
    }
  ],
  "name": "AltStore",
  "identifier": "com.rileytestut.AltStore",
  "news": [
    {
      "notify": false,
      "tintColor": "8A28F7",
      "title": "Delta Gaining DS Support",
      "date": "2019-09-25",
      "identifier": "delta-ds-support",
      "imageURL": "https://user-images.githubusercontent.com/705880/65603159-0676a400-df5a-11e9-882e-dc5566f4d50a.png",
      "caption": "Available this Saturday for patrons, coming soon for everyone else."
    },
    {
      "notify": true,
      "tintColor": "8A28F7",
      "appID": "com.rileytestut.Delta",
      "title": "Delta Now Available",
      "date": "2019-09-28",
      "identifier": "delta-now-available",
      "imageURL": "https://user-images.githubusercontent.com/705880/65604130-c1ec0800-df5b-11e9-8150-7657c474e3c3.png",
      "caption": "Finally, relive your favorite NES, SNES, GB(C), GBA, and N64 games."
    },
    {
      "notify": false,
      "tintColor": "018084",
      "title": "Welcome to AltStore",
      "date": "2019-09-28",
      "identifier": "welcome-to-altstore",
      "caption": "Please read the FAQ for help with installing apps.",
      "url": "https://altstore.io/faq/"
    }
  ]
};

$done({body: JSON.stringify(obj)});

// Descriptions
