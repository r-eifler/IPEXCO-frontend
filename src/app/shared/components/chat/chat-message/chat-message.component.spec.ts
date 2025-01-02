import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ChatMessageComponent } from "./chat-message.component"
import { Component } from "@angular/core";

@Component({
    template: `
        <app-chat-message [role]="role">PROJECT_ME</app-chat-message>
    `,
    imports: [ChatMessageComponent],
})
class TestHostComponent {
    role = undefined;
}

describe('ChatMessage', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let testHost: TestHostComponent;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        testHost = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should create', () => {
        expect(testHost).toBeTruthy();
    });

    it('should set the class according to the specified role',() => {
        const chatContainer = element.querySelector('div');
        testHost.role = 'mock-role';
        fixture.detectChanges();

        expect(chatContainer).toHaveClass('mock-role');
    });

    it('should project its content', () => {
        expect(element.innerText).toEqual('PROJECT_ME');
    });
})
