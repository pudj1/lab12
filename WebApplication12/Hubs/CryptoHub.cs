namespace WebApplication12.Hubs
{
    using Microsoft.AspNetCore.SignalR;
    public class CryptoHub : Hub
    {
        public async Task GetCryptos(string name, string price)
        {
            await Clients.All.SendAsync("GetCryptos", name, price);
        }
    }
}
