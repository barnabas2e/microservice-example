import { Component, OnInit } from '@angular/core';
import { Course } from 'src/models/Course';
import { User } from 'src/models/User';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { Transaction } from 'src/models/Transaction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courseList: Array<Course>;
  errorMessage: string;
  infoMessage: string;
  currentUser: User;

  constructor(private userService: UserService, private courseService: CourseService, private router: Router) { 
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit(): void {
    this.findAllCourses();
  }

  findAllCourses() {
    this.courseService.findAllCourses().subscribe(data => {
      this.courseList = data;
    });
  }

  enroll(course: Course) {
    if (!this.currentUser){
      this.errorMessage = 'You should sign in to enroll a course';
      return;
    }
    const transaction = new Transaction();
    transaction.userId = this.currentUser.id;
    transaction.course = course;

    this.courseService.enroll(transaction).subscribe(data => {
      this.infoMessage = 'Mission is completed.';
    }, err => {
      this.errorMessage = 'Unexpected error occurred.';
    });
  }

  detail(course: Course) {
    localStorage.setItem('currentCourse', JSON.stringify(course));
    this.router.navigate(['/detail', course.id]);
  }
}
