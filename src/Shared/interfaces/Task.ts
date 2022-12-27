export interface Task {
  title: string;
  notes: string;
  completed: boolean;
  reminderSet: boolean;
  reminderDate: Date;
  dateCreated: Date;
  userId: number;
}
