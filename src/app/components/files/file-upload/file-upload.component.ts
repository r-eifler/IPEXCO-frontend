import { Component, EventEmitter, Output, Input} from "@angular/core";

interface Data {
  name: string
  file: any
}

@Component({
  selector: "app-template-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
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

      this.name = inputNode.files[0].name;
      reader.readAsText(inputNode.files[0]);
    }
  }

}
