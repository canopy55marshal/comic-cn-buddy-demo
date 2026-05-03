import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MvpService } from "./mvp.service";

@Controller()
export class MvpController {
  constructor(private readonly mvpService: MvpService) {}

  @Get("health")
  getHealth() {
    return this.mvpService.getHealth();
  }

  @Get("overview")
  getOverview() {
    return this.mvpService.getOverview();
  }

  @Get("users/me")
  getCurrentUser() {
    return this.mvpService.getCurrentUser();
  }

  @Get("users/pool")
  getUserPool(
    @Query("role") role?: string,
    @Query("onlineOnly") onlineOnly?: string
  ) {
    return this.mvpService.getUserPool(role, onlineOnly === "true");
  }

  @Post("users/register-light")
  createLightUser(
    @Body()
    body: {
      name: string;
      role: string;
      tags?: string[];
      onlineStatus?: string;
      currentZone?: string;
    }
  ) {
    return this.mvpService.createLightUser(body);
  }

  @Get("merchants")
  getMerchants(@Query("category") category?: string) {
    return this.mvpService.getMerchants(category);
  }

  @Get("orders")
  getOrders() {
    return this.mvpService.getOrders();
  }

  @Post("orders")
  createOrder(
    @Body()
    body: {
      merchantName: string;
      items?: string[];
      totalAmount?: number;
    }
  ) {
    return this.mvpService.createOrder(body);
  }

  @Get("buddies")
  getBuddies(@Query("purpose") purpose?: string) {
    return this.mvpService.getBuddies(purpose);
  }

  @Post("invitations")
  createInvitation(
    @Body()
    body: {
      buddyName: string;
      message?: string;
    }
  ) {
    return this.mvpService.createInvitation(body);
  }

  @Get("services")
  getServices(@Query("category") category?: string) {
    return this.mvpService.getServices(category);
  }

  @Get("queue-options")
  getQueueOptions() {
    return this.mvpService.getQueueOptions();
  }

  @Post("queue-bookings")
  createQueueBooking(
    @Body()
    body: {
      queueId: number;
    }
  ) {
    return this.mvpService.createQueueBooking(body);
  }

  @Get("reminders")
  getReminders() {
    return this.mvpService.getReminderItems();
  }

  @Post("reminders/toggle")
  toggleReminder(
    @Body()
    body: {
      reminderId: number;
    }
  ) {
    return this.mvpService.toggleReminder(body);
  }

  @Get("travel-options")
  getTravelOptions() {
    return this.mvpService.getTravelOptions();
  }

  @Post("travel/select")
  selectTravelOption(
    @Body()
    body: {
      travelId: number;
    }
  ) {
    return this.mvpService.selectTravelOption(body);
  }

  @Post("bookings")
  createBooking(
    @Body()
    body: {
      serviceName: string;
      contactName: string;
      slotTime: string;
    }
  ) {
    return this.mvpService.createBooking(body);
  }

  @Get("zones")
  getZones() {
    return this.mvpService.getZones();
  }

  @Get("zones/:name/spots")
  getZoneSpots(@Param("name") name: string) {
    return this.mvpService.getZoneSpots(name);
  }

  @Get("map/search")
  searchMap(@Query("q") q: string) {
    return this.mvpService.searchMap(q);
  }
}
