import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { of } from 'rxjs';

import { LibModule } from '../../../../lib/lib.module';
import { CropListItemComponent } from './crop-list-item.component';
import { PlantStore } from '../../../../stores/plant-store.service';
import { TaskStore } from '../../../../stores/task-store.service';
import { VarietyStore } from '../../../../stores/variety-store.service';
import { CropFactory } from '../../../../factories/crop-factory.service';
import { PlantFactory } from '../../../../factories/plant-factory.service';
import { TaskFactory } from '../../../../factories/task-factory.service';

describe('CropListItemComponent (with spy)', () => {
  let component: CropListItemComponent;
  let fixture: ComponentFixture<CropListItemComponent>;
  let plantStore: any;
  let taskStore: any;
  let varietyStore: any;
  let cropFactory: CropFactory;
  let plantFactory: PlantFactory;
  let taskFactory: TaskFactory;

  beforeEach(async () => {
	plantStore = jasmine.createSpyObj('PlantStore', ['read']);
	taskStore = jasmine.createSpyObj('TaskStore', ['read']);
	varietyStore = jasmine.createSpyObj('VarietyStore', ['read']);

    await TestBed.configureTestingModule({
      declarations: [ CropListItemComponent ],
      imports: [ TranslateModule.forRoot(), LibModule ],
      providers: [
        { provide: PlantStore, useValue: plantStore },
        { provide: TaskStore, useValue: taskStore },
        { provide: VarietyStore, useValue: varietyStore },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    cropFactory = TestBed.inject(CropFactory);
    plantFactory = TestBed.inject(PlantFactory);
    taskFactory = TestBed.inject(TaskFactory);

    fixture = TestBed.createComponent(CropListItemComponent);
    component = fixture.componentInstance;
  });

  it('should contain crop name & color', () => {
	const plants = [
      plantFactory.create({ name: 'Basil', color:'#ff0000' }),
      plantFactory.create({ name: 'Tomato', color:'#0000ff' }),
    ];
    const plantReadSpy = plantStore.read.and.callFake(
      id => of(plants.find(plant => plant.id === id))
    );
    const crop = cropFactory.create({ plant_ids: [ plants[0].id, plants[1].id ] });
    component.crop = crop;

    fixture.detectChanges();

    expect(plantReadSpy.calls.count()).toBe(2);
    const root: HTMLElement = fixture.nativeElement;
    const spanAvatar = root.querySelector<HTMLElement>('span:nth-child(1)');
    expect(spanAvatar.style.backgroundColor).toBe('rgb(255, 0, 0)');
    const spanName = root.querySelector<HTMLElement>('span:nth-child(2)');
    expect(spanName.textContent).toContain('Basil Tomato');
  });

  it('should contain last done task & first todo task', () => {
	const plant = plantFactory.create();
    const plantReadSpy = plantStore.read.and.callFake(_ => of(plant));
    const tasks = [
      taskFactory.create({ done: true }),
      taskFactory.create({ done: true }),
      taskFactory.create({ done: false }),
      taskFactory.create({ done: false }),
    ];
    const taskReadSpy = taskStore.read.and.callFake(
      id => of(tasks.find(task => task.id === id))
    );
    const crop = cropFactory.create({
	  plant_ids: [ plant.id ],
      task_ids: [ tasks[0].id, tasks[1].id, tasks[2].id, tasks[3].id ],
    });
    component.crop = crop;

    fixture.detectChanges();

    expect(plantReadSpy.calls.count()).toBe(1);
    expect(taskReadSpy.calls.count()).toBe(4);
    const root: HTMLElement = fixture.nativeElement;
    const spanDone = root.querySelector<HTMLElement>('span.task-done');
    expect(spanDone.textContent).toContain(tasks[1].type);
    const spanTodo = root.querySelector<HTMLElement>('span.task-todo');
    expect(spanTodo.textContent).toContain(tasks[2].type);
  });

});