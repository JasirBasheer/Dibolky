import "reflect-metadata";
import { 
    registerModels, 
    registerServices, 
    registerControllers, 
    registerRepositories, 
} from "./modules";

export const registerDependencies = () => {
  registerModels();
  registerRepositories();
  registerServices();
  registerControllers();
};
