import { DataJob } from "../plunet/data-job";
import _ from "lodash";

export class JobService {
  private dataJob;
  constructor() {
    this.dataJob = new DataJob();
  }
}