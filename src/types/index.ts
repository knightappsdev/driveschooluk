export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  rating: number;
  city: string;
  experience: number;
  costPerHour: number;
  transmission: string;
  specialty: string;
  summary: string;
  availability: string;
  gender: string;
  nationality: string;
  religion: string;
  ethnicity: string;
}

export interface Course {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  hours: string;
  price: string;
  features: string[];
  registeredStudents: number;
  passRate: number;
  rating: number;
  totalHours: number;
  whyChoose: string;
  fullFeatures: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
}
