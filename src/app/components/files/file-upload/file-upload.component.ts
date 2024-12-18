import { Component, EventEmitter, Output, Input} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

interface Data {
  name: string
  file: any
}

@Component({
    selector: "app-template-file-upload",
    imports: [
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: "./file-upload.component.html",
    styleUrls: ["./file-upload.component.scss"]
})
export class TemplateFileUploadComponent {

  @Input() type;
  @Output() fileSelected= new EventEmitter<string>();;

  private selectedFile;
  name: string

  constructor() {}

  // onSubmit() {
  //   const uploadFile: PDDLFile = {
  //     _id: null,
  //     path: "",
  //     name: this.fileForm.controls.name.value,
  //     type: this.type,
  //     domain: this.fileForm.controls.domain.value,
  //     content: this.fileObject,
  //   };

  //   this.fileService.saveFile(uploadFile);
  // }

  onUploadFileSelected() {
    const inputNode: any = document.querySelector("#file" + this.type);
    let fileObject = inputNode.files[0];

    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
        this.fileSelected.emit(this.selectedFile)
      };

      this.name = fileObject.name;
      console.log(this.name)
      reader.readAsText(fileObject);
    }
  }

}
