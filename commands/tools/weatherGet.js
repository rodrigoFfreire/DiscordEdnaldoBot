const {
  SlashCommandBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
require("dotenv").config();
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription(
      "Retorna diversas informa\u00e7\u00f5es sobre qualquer cidade"
    )
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("{Cidade,Pa\u00eds} (Ex: Lisbon, Los Angeles, Tokyo...")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription(
          "{Codigo de duas letras do Pa\u00eds} (Ex: PT, US, JP...)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription(
          "Para pa\u00edses que sejam constituidos por estados (Ex: California, British Columbia...)"
        )
        .setRequired(false)
    ),
  async execute(interaction, client) {
    console.log(`WEATHER UTILIZADO POR ${interaction.user.id}`);

    const days = [
      "Domingo",
      "Segunda",
      "Ter\u00e7a",
      "Quarta",
      "Quinta",
      "Sexta",
      "S\u00e1bado",
    ];
    const RESULT_LIMIT = 3;
    const CITY_OPTION = interaction.options.getString("city");
    const COUNTRY_OPTION = interaction.options.getString("country");
    let STATE_OPTION = interaction.options.getString("state");
    const CITY = CITY_OPTION.toLowerCase();
    const COUNTRY = COUNTRY_OPTION.toUpperCase();
    let geo_data = [];
    let weather_data = [];
    let geo_data_filtered = [];

    const GEOCODE_CALL = `http://api.openweathermap.org/geo/1.0/direct?q=${CITY}&limit=${RESULT_LIMIT}&appid=${process.env.WEATHER_API_KEY}`;
    const WEATHER_CALL = `http://api.openweathermap.org/data/2.5/weather?&lat=${resolvedCityCoords[0]}&lon=${resolvedCityCoords[1]}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    // GEOCODE API
    try {
      const raw = await fetch(GEOCODE_CALL);
      geo_data = await raw.json();
      console.log("GEOCODE", geo_data);
    } catch (error) {
      console.log(error, "GEOCODE API FAILED!");
      return await interaction.reply({
        content: `:( Erro na API! Causa: ${error.message}`,
        ephemeral: true,
      });
    }

    if (STATE_OPTION === null) STATE_OPTION = "";
    if (geo_data.length === 0)
      return await interaction.reply({
        content: "Input nao valido. Tenta outra vez!",
        ephemeral: true,
      });

    for (let i = 0; i < geo_data.length; i++) {
      if (
        (geo_data[i].country === COUNTRY && !geo_data[i].state) ||
        (geo_data[i].country === COUNTRY &&
          geo_data[i].state.toLowerCase() === STATE_OPTION.toLowerCase())
      ) {
        geo_data_filtered = [];
        geo_data_filtered.push(geo_data[i]);
        break;
      } else if (geo_data[i].STATE_OPTION) {
        if (geo_data[i].state.toLowerCase() !== STATE_OPTION.toLowerCase())
          geo_data_filtered.push(geo_data[i]);
      } else if (i >= geo_data.length - 1 && geo_data_filtered.length === 0)
        geo_data_filtered.push(geo_data[0]);
    }

    let resolvedCityCoords = [
      geo_data_filtered[0].lat,
      geo_data_filtered[0].lon,
    ];

    // WEATHER API
    try {
      const raw = await fetch(WEATHER_CALL);
      weather_data = await raw.json();
    } catch (error) {
      console.log(error, "WEATHER API FAILED!");
      interaction.reply({
        content: `:( Erro na API! Tenta mais tarde Causa: ${error.message}`,
        ephemeral: true,
      });
    }

    const tmz = weather_data.timezone;
    const date = new Date();
    const unix_offset = parseInt(
      date.getTime() / 1000 + weather_data.timezone
    ).toFixed(0);

    const sun_hours = [
      new Date((weather_data.sys.sunrise + tmz) * 1000).getUTCHours(),
      new Date((weather_data.sys.sunset + tmz) * 1000).getUTCHours(),
    ];
    const sun_minutes = [
      new Date((weather_data.sys.sunrise + tmz) * 1000).getUTCMinutes(),
      new Date((weather_data.sys.sunset + tmz) * 1000).getUTCMinutes(),
    ];
    const local_hours = [new Date(unix_offset * 1000).getUTCHours()];
    const local_minutes = [new Date(unix_offset * 1000).getUTCMinutes()];

    const format_time = (hours, minutes) => {
      let hours_formatted = [],
        minutes_formatted = [];

      for (let i = 0; i < hours.length; i++) {
        if (hours[i].toString().length === 1) {
          hours_formatted[i] = `0${hours[i]}`;
        } else {
          hours_formatted[i] = hours[i].toString();
        }

        if (minutes[i].toString().length === 1) {
          minutes_formatted[i] = `0${minutes[i]}`;
        } else {
          minutes_formatted[i] = minutes[i].toString();
        }
      }
      return [hours_formatted, minutes_formatted];
    };

    if (!geo_data_filtered[0].state)
      await interaction.reply({
        content: `Dados de ${geo_data_filtered[0].name}, ${geo_data_filtered[0].country}:\n\nTemperatura: ${weather_data.main.temp.toFixed(1)} C   (${weather_data.main.temp_min.toFixed(1)}/${weather_data.main.temp_max.toFixed(1)}) C\nHumidade: ${weather_data.main.humidity} %\nPress\u00e3o: ${weather_data.main.pressure} mBar\nVisibilidade: ${(weather_data.visibility / 1000).toFixed(0)} Km\n\nNascer do Sol: ${format_time(sun_hours, sun_minutes)[0][0]}:${format_time(sun_hours, sun_minutes)[1][0]}\nP\u00f4r do Sol: ${format_time(sun_hours, sun_minutes)[0][1]}:${format_time(sun_hours, sun_minutes)[1][1]}\nData e Hora Local: ${days[local_date.getDay()]}, ${local_date.getDate()}/${local_date.getMonth() + 1}/${local_date.getFullYear()} - ${format_time(local_hours, local_minutes)[0]}:${format_time(local_hours, local_minutes)[1]}`,
      });
    else
      await interaction.reply({
        content: `Dados de ${geo_data_filtered[0].name}, ${geo_data_filtered[0].country} - ${geo_data_filtered[0].state}:\n\nTemperatura: ${weather_data.main.temp.toFixed(1)} C   (${weather_data.main.temp_min.toFixed(1)}/${weather_data.main.temp_max.toFixed(1)}) C\nHumidade: ${weather_data.main.humidity} %\nPress\u00e3o: ${weather_data.main.pressure} mBar\nVisibilidade: ${(weather_data.visibility / 1000).toFixed(0)} Km\n\nNascer do Sol: ${format_time(sun_hours, sun_minutes)[0][0]}:${format_time(sun_hours, sun_minutes)[1][0]}\nP\u00f4r do Sol: ${format_time(sun_hours, sun_minutes)[0][1]}:${format_time(sun_hours, sun_minutes)[1][1]}\nData e Hora Local: ${days[local_date.getDay()]}, ${local_date.getDate()}/${local_date.getMonth() + 1}/${local_date.getFullYear()} - ${format_time(local_hours, local_minutes)[0]}:${format_time(local_hours, local_minutes)[1]}`,
      });
  },
};