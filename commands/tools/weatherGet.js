const {SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder} = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Informacoes sobre o tempo em qualquer cidade (Work In Progress)')
        .addStringOption((option) => 
            option
                .setName('city')
                .setDescription('\{Cidade,Pa\u00eds\} (Ex: Lisbon,PT)')
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName('state')
                .setDescription('Para pa\u00edses que sejam constituidos por estados (Ex: California, British Columbia...)')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        console.log(`WEATHER UTILIZADO POR ${interaction.user.id}`);

        const days = ['Domingo', 'Segunda', 'Ter\u00e7a', 'Quarta', 'Quinta', 'Sexta', 'S\u00e1bado'];
        const RESULT_LIMIT = 3;
        const CITY_OPTION = interaction.options.getString('city');
        const STATE = interaction.options.getString('state');
        const CITY = CITY_OPTION.charAt(0).toUpperCase() + CITY_OPTION.slice(1, -3).toLowerCase();
        const COUNTRY = CITY_OPTION.slice(-2).toUpperCase();
        let resolvedCityCoords = [0, 0];

        const GEOCODE_CALL = `http://api.openweathermap.org/geo/1.0/direct?q=${CITY}&limit=${RESULT_LIMIT}&appid=${process.env.WEATHER_API_KEY}`
        
        // GEOCODE API
        try {
            const raw = await fetch(GEOCODE_CALL);
            const data = await raw.json();
            console.log('GEOCODE', data);

            data_filtered = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].country !== COUNTRY) {
                    if (i >= data.length - 1 && data_filtered.length === 0) throw new Error('Pa\u00ed nao valido!');
                }
            }

            
        } catch(error) {
            console.log(error, 'GEOCODE API FAILED!');
            interaction.reply({content: `:( Erro na API! Causa: ${error}`, ephemeral: true});
        }

        

        const WEATHER_CALL = `http://api.openweathermap.org/data/2.5/weather?&lat=${resolvedCityCoords[0]}&lon=${resolvedCityCoords[1]}&appid=${process.env.WEATHER_API_KEY}&units=metric`

        // WEATHER API
        try {
            const raw = await fetch(WEATHER_CALL);
            const data = await raw.json();


            const tmz = data.timezone;
            const sunrise = new Date((data.sys.sunrise + tmz) * 1000);
            const sunset = new Date((data.sys.sunset + tmz) * 1000);


            const date = new Date();
            const unix_offset = parseInt((date.getTime() / 1000) + data.timezone).toFixed(0);
            const local_date = new Date(unix_offset * 1000);


            const sun_hours = [sunrise.getUTCHours(), sunset.getUTCHours()];
            const sun_minutes = [sunrise.getUTCMinutes(), sunset.getUTCMinutes()];

            const local_hours = [local_date.getUTCHours()];
            const local_minutes = [local_date.getUTCMinutes()];


            const format_time = (hours, minutes) => {
                let hours_formatted = [] , minutes_formatted = [];

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
            }

            if (data.coord.lon === 0 && data.coord.lat === 0) {interaction.reply({content: "Local N\u00e3o V\u00e1lido!"})} 
            else {
                await interaction.reply({content: `Dados de ${CITY}, ${COUNTRY}:\n\nTemperatura: ${data.main.temp.toFixed(1)} C   (${data.main.temp_min.toFixed(1)}/${data.main.temp_max.toFixed(1)}) C\nHumidade: ${data.main.humidity} %\nPress\u00e3o: ${data.main.pressure} mBar\nVisibilidade: ${(data.visibility/1000).toFixed(0)} Km\n\nNascer do Sol: ${format_time(sun_hours, sun_minutes)[0][0]}:${format_time(sun_hours, sun_minutes)[1][0]}\nP\u00f4r do Sol: ${format_time(sun_hours, sun_minutes)[0][1]}:${format_time(sun_hours, sun_minutes)[1][1]}\nData e Hora Local: ${days[local_date.getDay()]}, ${local_date.getDate()}/${local_date.getMonth() + 1}/${local_date.getFullYear()} - ${format_time(local_hours, local_minutes)[0]}:${format_time(local_hours, local_minutes)[1]}`});
            }
        } catch(error) {
            console.log(error, 'WEATHER API FAILED!');
            interaction.reply({content: ':( Erro na API! Tenta mais tarde :(', ephemeral: true});
        }

        
    }
    
}