import { BaseService } from "@shared/lib/base/service";
import { AppContext } from "@shared/lib/context";

class HealthCheckService extends BaseService {
    get = (context: AppContext) => {
        this.logger.info({
            context,
            message: "Health check service",
        });
        return { hello: "world" };
    };
}

const healthCheckService = new HealthCheckService();
export default healthCheckService;
