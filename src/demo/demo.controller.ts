import { Controller, Get, UseGuards } from '@nestjs/common';
import { MustBeLogged } from 'src/auth/guards/must-be-logged.guard';
import { MustBeVerified } from 'src/auth/guards/must-be-verified.guard';
import { MustNotBeLogged } from 'src/auth/guards/must-not-be-logged.guard';

@Controller('demo')
export class DemoController {
  /**
   * GET for /demo/free-for-all is a public resource.
   * It will not be enforced by the LoggedGuard.
   */
  @Get('free-for-all')
  public freeForAll() {
    return {
      message:
        "Hello World! I'm a public resource, it doesn't matter if you're logged, verified or a guest.",
    };
  }

  /**
   * GET for /demo/logged-only is a protected resource.
   * The business logic is implemented in the LoggedGuard.
   */
  @UseGuards(MustBeLogged)
  @Get('logged-only')
  public loggedOnly() {
    return {
      message:
        "Hello registered users! I'm a logged only resource, you need to be logged to access me, but I don't care if you're a verified user or not.",
    };
  }

  /**
   * GET for /demo/world is a protected resource.
   * The business logic is implemented in the LoggedGuard.
   */
  @UseGuards(MustNotBeLogged)
  @Get('guest-only')
  public guestOnly() {
    return {
      message:
        "Hello guests! I'm a protected resource, but the other way around. Only guests like you can access me.",
    };
  }

  @UseGuards(MustBeVerified)
  @Get('verified-only')
  public verifiedOnly() {
    return {
      message:
        "Hello verified users! I'm a verified only resource, you need to be registered, logged AND your account has to be verified in order to access me.",
    };
  }
}
