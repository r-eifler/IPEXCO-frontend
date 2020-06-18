import { Project } from './../../../interface/project';
import { DomainFilesService, ProblemFilesService, DomainSpecificationFilesService } from './../../../service/pddl-file-services';
import { DemosService } from './../../../service/demo-services';
import { ProjectsService } from './../../../service/project-services';
import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Demo } from 'src/app/interface/demo';

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.css']
})
export class UserMainPageComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    public projectsService: ProjectsService,
    public demosService: DemosService,
    public domainFilesService: DomainFilesService,
    public problemFilesService: ProblemFilesService,
    public domainSpecificationFilesService: DomainSpecificationFilesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();

    this.projectsService.findCollection();
    this.demosService.findCollection();
    this.domainFilesService.findFiles();
    this.problemFilesService.findFiles();
    this.domainSpecificationFilesService.findFiles();
  }

  openProject(project: Project) {
    console.log(''.concat(...['/projects/', project._id, '/overview']));
    this.router.navigate([''.concat(...['/projects/', project._id, '/overview'])], { relativeTo: this.route });
  }

  toProjectCollection() {
    this.router.navigate(['/projects'], { relativeTo: this.route });
  }

  openDemo(demo: Demo) {
    this.router.navigate([''.concat(...['/demos/', demo._id, '/help'])], { relativeTo: this.route });
  }

  toDemoCollection() {
    this.router.navigate(['/demos'], { relativeTo: this.route });
  }

}
