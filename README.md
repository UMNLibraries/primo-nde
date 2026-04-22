# UMN Libraries Primo NDE Customization Packages

University of Minnesota's Primo NDE customization monorepo.

## Getting started

1. Make sure you have node.js version 20+ installed.
2. Clone this repository.
3. From the project's root directory, run `npm install`.

## Local development

### Primo views

You can preview local changes in a Primo NDE view using the local development server proxy. Run `npx nx serve {project-name}` to start the server, and then navigate to the corresponding view URL.

| Project name      | URL                                             |
| ----------------- | ----------------------------------------------- |
| `crookston-view`  | http://localhost:4201/nde/home?vid=01UMN_INST:C |
| `duluth-view`     | http://localhost:4201/nde/home?vid=01UMN_INST:D |
| `morris-view`     | http://localhost:4201/nde/home?vid=01UMN_INST:M |
| `twincities-view` | http://localhost:4201/nde/home?vid=01UMN_INST:T |

To override the default proxy target, set a `PROXY_TARGET` environment variable (e.g. `PROXY_TARGET='https://primo.lib.umn.edu' npx nx serve {project-name}`).

### Add-ons

TBD

## Deployment

### Deploying NDE view customization packages

Run `npx nx run-many -t package` to build customization packages for all views. A zip file for each view will be created under `dist/packages/`. To deploy a package, upload its zip file in the Manage Customization Package tab in Alma (under Discovery > Manage Views > {view_code}).

Alternatively, you could run `npx nx affected -t package` which will only re-create packages for views that have changed.

## Testing

### Running unit tests (Vitest)

Run `npx nx run-many -t test` to execute all unit tests or `npx nx affected -t test` to test only projects that are impacted by recent changes.

### Running e2e tests (Playwright)

TODO

## Linting

Run `npx nx run-many -t lint` to lint all projects or `npx nx affected -t lint` to lint only projects that are impacted by recent changes.

## Workspace structure

### View projects

The `apps/views/*` projects contains the component mappings, styles, and assets for each campus view. In addition to view-specific customizations, the view projects inherit common component mappings, styles, and assets from the `libs/base-view` project. To understand how views are built, refer to `tools/plugins/primo-view.plugin.ts` and `tools/webpack/webpack.config.js`.

### Vendor project

`libs/vendor/custom-module` is a git subtree that contains a minimally-modified fork of the Ex Libris [NDE Customization package repository](https://github.com/ExLibrisGroup/customModule). From this project, we primarily depend on:

- `src/bootstrap.ts`
- `proxy/proxy.conf.mjs`

Use the `tools/scripts/sync-vendor.sh` to pull in updates from the upstream vendor project. The script will present a diff and prompt for conformation before merging any changes.

### Libraries

The majority of the custom components are here. You can run `npx nx graph` to get a visual depiction of the project dependencies.

## Resources

- [Primo NDE customization package documentation](<https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/020Primo_VE/Primo_VE_(English)/030Primo_VE_User_Interface/010NDE_UI_Customization_-_Best_Practices>)
- [Primo email list](https://el-una.org/about/mailing-lists/primo-email-list)
- [Nx documentation](https://nx.dev/docs)
- [Angular docs](https://v18.angular.dev/overview)
- [Angular Material docs](https://v18.material.angular.dev/)
