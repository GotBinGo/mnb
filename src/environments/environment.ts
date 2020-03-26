// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  idleTime: 5 * 60_000,
  event: {
    categories: [
      {
        icon: 'fa-bowling-ball',
        color: '#c7610a',
        labels: ['Narancssárga kategória']
      },
      {
        icon: 'fa-chess',
        color: '#c7a811',
        labels: ['Sárga kategória']
      },
      {
        icon: 'fa-code',
        color: '#0a70c7',
        labels: ['Kék kategória']
      },
      {
        icon: 'fa-comments',
        color: '#c70a0a',
        labels: ['Piros kategória']
      },
      {
        icon: 'fa-mug-hot',
        color: '#04a946',
        labels: ['Zöld kategória']
      },
      {
        icon: 'fa-pizza-slice',
        color: '#7804a9',
        labels: ['Lila kategória']
      }
    ]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
