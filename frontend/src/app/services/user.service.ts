import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {

  constructor() { }

  public getUserInfo(uuid: string) {
    //TODO change this to get user data from the backend
    const user = {
      uuid: 'XXX',
      name: 'John Doe',
      email: 'john.doe@example.com',
      assignments: [
        "468879bf-8e44-4c95-8321-edd2b8fb0108"
      ],
      birthday: "",
    }

    return new Promise((resolve) => { resolve(user) });
  }

  public getProjects() {
    //TODO change this to get project data from the backend
    const projects = [
      {
        uuid: "468879bf-8e44-4c95-8321-edd2b8fb0108",
        projectFullName: "SOME FULL PROJECT NAME",
        projectName: "SFPN",
        startDate: "12/31/2024",
        status: "Active"
      },
      {
        uuid: "8242e65d-75ac-4f4b-b761-05b9343b8507",
        projectFullName: "PROJECT OF IMPORTANCE",
        projectName: "POI",
        startDate: "12/31/2024",
        status: "Active"
      }
    ]

    return new Promise((resolve) => { resolve(projects) });
  }
}
