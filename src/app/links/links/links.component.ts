import { Component } from '@angular/core';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent {
  public links: Link[] = [
    { imgSrc: 'assets/apple-touch-icon-180x180.png', name: 'AutSoft Hub', url: 'http://autsofthub.azurewebsites.net', tags: [] },
    { imgSrc: 'assets/apple-touch-icon-180x180.png', name: 'AutSoft Portal', url: 'https://www.autsoft.net', tags: [] },
    { icon: 'fab fa-jira', name: 'JIRA', url: 'https://jira.autsoft.hu', tags: [] },
    {
      imgSrc: 'https://cdn.vsassets.io/content/icons/favicon.ico',
      name: 'Azure DevOps',
      url: 'https://dev.azure.com/autsoft',
      tags: []
    },
    { icon: 'fab fa-gitlab', name: 'Gitlab', url: 'https://gitlab.autsoft.hu', tags: [] },
    { imgSrc: 'https://redmine.autsoft.hu/favicon.ico', name: 'Redmine', url: 'https://redmine.autsoft.hu', tags: [] },
    {
      imgSrc: 'https://nexon.autsoft.hu/content/favicon/apple-touch-icon.png',
      name: 'NEXON',
      url: 'https://nexon.autsoft.hu',
      tags: []
    },
    {
      imgSrc: 'https://blobs.officehome.msocdn.com/images/content/images/favicon_metro-bb8cb440e5.ico',
      name: 'Office365',
      url: 'http://portal.office365.com',
      tags: []
    },
    { imgSrc: 'https://portal.azure.com/favicon.ico', name: 'Azure Portal', url: 'https://portal.azure.com', tags: [] },
    {
      imgSrc: 'https://autsoft.sharepoint.com/_layouts/15/images/favicon.ico',
      name: 'SharePoint',
      url: 'https://autsoft.sharepoint.com',
      tags: []
    },
    {
      imgSrc: 'https://sonar.autsoft.hu/apple-touch-icon-76x76.png',
      name: 'SonarQube',
      url: 'https://sonar.autsoft.hu',
      tags: []
    },
    {
      imgSrc: 'https://sonar.autsoft.hu/apple-touch-icon-76x76.png',
      name: 'SonarQube v2',
      url: 'https://sonar2.autsoft.hu',
      tags: []
    }
  ];

  constructor() {}

  openLink(link: Link) {
    window.open(link.url, '_blank');
  }
}

export interface Link {
  icon?: string;
  imgSrc?: string;
  name: string;
  url: string;
  tags: string[];
}
