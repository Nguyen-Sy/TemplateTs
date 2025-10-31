import { BaseService } from "@shared/lib/base/service";
import { BadRequestError } from "@shared/lib/http/httpError";

class HealthCheckService extends BaseService {
    get = () => {
        throw new BadRequestError("Test error");
    };
}

const healthCheckService = new HealthCheckService();
export default healthCheckService;
