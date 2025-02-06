using Microsoft.AspNetCore.SignalR;

namespace Chatterbox.Hub
{
    public class Chathub : Hub<IChatHub>
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Others.SuccessSendMessage(Context.ConnectionId, $"joined the party!");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.Others.SuccessSendMessage(Context.ConnectionId, $"left the party!");
        }


        public async Task Send(string user, string message)
        {
            await Clients.All.SuccessSendMessage(user, message);
        }

    }


    public interface IChatHub
    {
        Task SuccessSendMessage(string user, string message);
    }


}
