import 'reflect-metadata';

import Stripe from 'stripe';
import { AuthController } from './api/controllers/auth.controller';
import { ExplorerController } from './api/controllers/explorer.controller';
import { GatewayController } from './api/controllers/gateway-connect.controller';
import { InstructorController } from './api/controllers/instructor.controller';
import { LessonController } from './api/controllers/lesson.controller';
import { PaymentsController } from './api/controllers/payments.controller';
import { StripeWebhookController } from './api/controllers/stripe.controller';
import { StudentController } from './api/controllers/student.controller';
import { HashService } from './application/ports/in/hash.service';
import { PaymentService } from './application/ports/in/payment.service';
import { TokenService } from './application/ports/in/token.service';
import { GatewayService } from './application/ports/out/gateway.service';
import { InstructorProfileRepository } from './application/ports/out/instructor-profile.repository';
import { InstructorsRepository } from './application/ports/out/instructors.repository';
import { LessonRepository } from './application/ports/out/lesson.repository';
import { UsersRepository } from './application/ports/out/users.repository';
import { AuthInstructorUseCase } from './application/usecases/authenticate/auth-instructor/auth-instructor.usecase';
import { FindProfileUseCase as FindInstructorProfileUseCase } from './application/usecases/authenticate/find-profile/find-profile.usecase';
import { FindAllInstructorsUseCase } from './application/usecases/explorer/find-all-instructors/find-all-instructors.usecase';
import { CreateInstructorUseCase } from './application/usecases/instructor/create-instructor/create-instructor.usecase';
import { FindLessonsByStudentUseCase } from './application/usecases/lesson/find-by-student/find-lessons-by-student.usecase';
import { CreatePixIntentUseCase } from './application/usecases/payment/create-pix-intent/create-pix-intent.usecase';
import { ConnectStripeUseCase } from './application/usecases/stripe/connect-stripe/connect-stripe.usecase';
import { HandleStripeWebhookUseCase } from './application/usecases/stripe/handle-webhook/handle-webhook.usecase';
import { CreateStudentUseCase } from './application/usecases/students/create-student/create-student.usecase';
import { container } from './infra/di/container';
import { createRouter } from './infra/loader/loader';
import { Argon2HashService } from './infra/persistence/in/services/argon-hash.service';
import { JoseTokenService } from './infra/persistence/in/services/jose-token.service';
import { StripePaymentService } from './infra/persistence/in/services/stripe-payment.service';
import { StripeService } from './infra/persistence/in/services/stripe.service';
import { CookieService } from './infra/persistence/out/cookies/cookies.service';
import { ExpressCookieService } from './infra/persistence/out/cookies/express-cookies.service';
import { TypeormLessonRepository } from './infra/persistence/out/repositories/lesson/typeorm-lesson.repository';
import { TypeormInstructorProfileRepository } from './infra/persistence/out/repositories/users/typeorm-instructor-profile.repository';
import { TypeormInstructorsRepository } from './infra/persistence/out/repositories/users/typeorm-instructor.repository';
import { TypeormUserRepository } from './infra/persistence/out/repositories/users/typeorm-users.repository';
import { stripe } from './lib/stripe/stripe-setup';

container.registerInstance(Stripe, stripe);

container.register(UsersRepository, TypeormUserRepository);
container.register(HashService, Argon2HashService);
container.register(TokenService, JoseTokenService);
container.register(CookieService, ExpressCookieService);
container.register(InstructorProfileRepository, TypeormInstructorProfileRepository);
container.register(LessonRepository, TypeormLessonRepository);
container.register(GatewayService, StripeService);
container.register(InstructorsRepository, TypeormInstructorsRepository);
container.register(PaymentService, StripePaymentService);

container.resolve(AuthInstructorUseCase);
container.resolve(CreateStudentUseCase);
container.resolve(CreateInstructorUseCase);
container.resolve(HandleStripeWebhookUseCase);
container.resolve(ConnectStripeUseCase);
container.resolve(FindInstructorProfileUseCase);
container.resolve(FindAllInstructorsUseCase);
container.resolve(CreatePixIntentUseCase);
container.resolve(FindLessonsByStudentUseCase);

const controllers = [
  AuthController,
  InstructorController,
  LessonController,
  PaymentsController,
  GatewayController,
  StripeWebhookController,
  StudentController,
  ExplorerController,
];

const routers = createRouter(controllers);

export { routers };
