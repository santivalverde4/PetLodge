import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AvailableRoomsQueryDto } from './dto/available-rooms-query.dto';
import { RoomsService } from './rooms.service';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'List all rooms' })
  @ApiOkResponse({ description: 'Array of rooms' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'List available rooms for a date range' })
  @ApiQuery({ name: 'from', type: String, example: '2026-04-15' })
  @ApiQuery({ name: 'to', type: String, example: '2026-04-20' })
  @ApiOkResponse({ description: 'Array of available rooms' })
  findAvailable(@Query() query: AvailableRoomsQueryDto) {
    return this.roomsService.findAvailable(query.from, query.to);
  }
}
