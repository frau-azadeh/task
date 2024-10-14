export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  progress: number; 
  startDate: string; 
  endDate: string;  
}
