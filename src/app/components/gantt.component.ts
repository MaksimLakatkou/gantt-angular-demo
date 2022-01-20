import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {TaskService} from "../services/task.service";
import {LinkService} from "../services/link.service";
import {Task} from "../models/task";
import {Link} from "../models/link";

import "dhtmlx-gantt";
declare let gantt: any;

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'gantt',
	// styles: [
	//     `
	//     :host{
	//         display: block;
	//         height: 600px;
	//         position: relative;
	//         width: 100%;
	//     }
	// `],
	styleUrls: ['./gantt.component.css'],
	providers: [TaskService, LinkService],
	// template: "<div #gantt_here style='width: 100%; height: 100%;'></div>",
	template: `<div #gantt_here class='gantt-chart'></div>`,
})

export class GanttComponent implements OnInit {
	@ViewChild("gantt_here") ganttContainer: ElementRef | undefined;

	constructor(private taskService: TaskService, private linkService: LinkService){}

	ngOnInit(){
		gantt.config.xml_date = '%Y-%m-%d %H:%i';

		gantt.init(document.querySelector(".gantt-chart"));
		// gantt.init(this.ganttContainer.nativeElement);

		const dp = gantt.createDataProcessor({
			task: {
				update: (data: Task) => this.taskService.update(data),
				create: (data: Task) => this.taskService.insert(data),
				delete: (id: number) => this.taskService.remove(id)
			},
			link: {
				update: (data: Link) => this.linkService.update(data),
				create: (data: Link) => this.linkService.insert(data),
				delete: (id: number) => this.linkService.remove(id)
			}
		});

		Promise.all([this.taskService.get(), this.linkService.get()])
			.then(([data, links]) => {
				gantt.parse({ data, links });
			});
	}
}