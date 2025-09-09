import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ServiceType } from 'src/app/global_specification/domain/services';
import { ExplanationInterfaceType, GeneralSettings, PropertyCreationInterfaceType } from 'src/app/project/domain/general-settings';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectProject, selectServices } from '../../state/home.selector';
import { loadServices, updateProject } from '../../state/home.actions';

@Component({
  selector: 'app-settings',
  imports: [
    PageModule,
    BreadcrumbModule,
    MatIconModule,
    RouterLink,
    MatExpansionModule,
    MatButtonModule,
	MatLabel,
	MatFormFieldModule,
	MatSlideToggleModule,
	MatCardModule,
	ReactiveFormsModule,
	FormsModule,
	MatButtonToggleModule,
	MatInputModule,
	MatFormFieldModule,
	MatOptionModule,
	MatSelectModule,
	MatCheckboxModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

	store = inject(Store)
	project = this.store.selectSignal(selectProject)
	services = this.store.selectSignal(selectServices)

    planners = computed(() => this.services()?.filter(s => s.type == ServiceType.PLANNER));
    explainer = computed(() => this.services()?.filter(s => s.type == ServiceType.EXPLAINER));
    tester = computed(() => this.services()?.filter(s => s.type == ServiceType.TESTER));
  
    ExplanationTypes = ExplanationInterfaceType;
    PropertyCreationTypes = PropertyCreationInterfaceType;
  
    fb = inject(FormBuilder);
  
    form = this.fb.group({
      services: this.fb.group({
        computePlanAutomatically: this.fb.control<boolean>(false, Validators.required),
        computeExplanationsAutomatically: this.fb.control<boolean>(false, Validators.required),
        planners: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
        explainer: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
        propertyChecker: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
        tester: this.fb.control<string[]>([]),
        verifier: this.fb.control<string[]>([]),
      }),
      interfaces: this.fb.group({
        propertyCreationInterfaceType: this.fb.control<PropertyCreationInterfaceType>(PropertyCreationInterfaceType.TEMPLATE_BASED, Validators.required),
        explanationInterfaceType: this.fb.control<ExplanationInterfaceType>(ExplanationInterfaceType.MIXED, Validators.required),
      }),
    })
  
    constructor() {

		console.log('load services for settings')
		this.store.dispatch(loadServices())

		effect(() => console.log(this.services()))

		effect(() => console.log( this.project()?.settings))
  
		effect(() => {
			const settings = this.project()?.settings;
			if (settings == null || settings == undefined){
				return;
			}
			console.log('load settings')

			try{
				if(settings.interfaces.explanationInterfaceType)
				this.form.controls.interfaces.controls.explanationInterfaceType.setValue(settings.interfaces.explanationInterfaceType);
				// this.form.controls.interfaces.controls.propertyCreationInterfaceType.setValue(settings.interfaces.propertyCreationInterfaceType);
			
				// this.form.controls.services.controls.computePlanAutomatically.setValue(settings.services.computePlanAutomatically);
				// this.form.controls.services.controls.computeExplanationsAutomatically.setValue(settings.services.computeExplanationsAutomatically);
				this.form.controls.services.controls.planners.setValue(
				(this.planners() ?? []).filter(s => settings.services.services.includes(s._id)).map(s => s._id)
				);
				this.form.controls.services.controls.explainer.setValue(
				(this.explainer() ?? []).filter(s => settings.services.services.includes(s._id)).map(s => s._id)
				);
				this.form.controls.services.controls.tester.setValue(
				(this.tester() ?? []).filter(s => settings.services.services.includes(s._id)).map(s => s._id)
				);
			}
			catch(e: any){
				console.log('Could not initialize settings!')
			}
		})
	
    }
  
    onSave() {

		console.log("save settings")
		const settings = this.project()?.settings;
		if (settings == null || settings == undefined){
			return;
		}
  
		let newSettings: GeneralSettings = {
			...settings,
			services: {
				computePlanAutomatically: this.form.controls.services.controls.computePlanAutomatically.value ?? true,
				computeExplanationsAutomatically: this.form.controls.services.controls.computeExplanationsAutomatically.value ?? true,
				services: [
					...this.form.controls.services.controls.planners.value ,
					...this.form.controls.services.controls.explainer.value,
					...(this.form.controls.services.controls.tester.value ?? []),
				].filter(e => e !== null)
			},
			interfaces: {
				explanationInterfaceType: this.form.controls.interfaces.controls.explanationInterfaceType.value ?? ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER,
				propertyCreationInterfaceType: this.form.controls.interfaces.controls.propertyCreationInterfaceType.value ?? PropertyCreationInterfaceType.TEMPLATE_BASED,
			}
		}
  
    	console.log(newSettings)

		const project = this.project()

		if(project === undefined){
			return
		}

		const new_project = {
			...project,
			settings,
		}

		this.store.dispatch(updateProject({project: new_project}))
  
    }

}
