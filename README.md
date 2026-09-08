# Energy Atlas 360°

Eight interactive energy systems with 38 component explanations. Includes the updated 3D models and unbranded content.

## Publish using GitHub and Vercel

1. Extract this ZIP.
2. Create a GitHub repository, for example `energy-atlas-360`.
3. Upload all extracted files and the `public` folder into the repository root. Upload the extracted contents, not the ZIP itself.
4. In Vercel, create a new project and import that GitHub repository.
5. Use Framework Preset **Other**. Keep the Root Directory at the repository root. Leave Build Command empty. The included `vercel.json` sets the Output Directory to `public`.
6. Deploy. Future commits to the connected production branch can trigger updated deployments.

No installation, build step, API key or environment variable is required. The Three.js dependency is included locally.

Vercel documentation: https://vercel.com/docs/builds/configure-a-build

## Preview locally

With Python 3 installed, run from the extracted folder:

```sh
python -m http.server 8000 --directory public
```

Open http://localhost:8000 in a modern browser with WebGL enabled. Use a local web server rather than opening the HTML file directly because the site uses JavaScript modules.

## Files

- `public/index.html`: page structure
- `public/style.css`: styling and responsive layout
- `public/app.js`: learning content and interaction controls
- `public/models.js`: 3D equipment models and rendering
- `public/three.module.js`: bundled Three.js dependency
- `public/THREE-LICENSE.txt`: required third-party licence notice
- `vercel.json`: static deployment configuration

The models are educational reconstructions, not exact engineering designs. Preserve the Three.js licence when redistributing its code. This export contains no hosting account credentials or original hosting configuration.

## Credits

Created by Foo Huey Chyun. Developed with assistance from OpenAI ChatGPT. Scientific information is adapted from the U.S. Energy Information Administration (EIA). Full topic-level source links are listed in the website footer under Credits & data sources. Models are educational reconstructions created for the site. Three.js is credited under its included MIT licence.

## System explorer

Select a functional system to highlight its equipment. Use Show selected system only to isolate it. Tap equipment or a component number for its explanation. All systems restores the full facility. Includes 26 functional groups across eight facilities. Source links open in the same window with Copy link fallbacks.
